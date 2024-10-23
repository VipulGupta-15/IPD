import streamlit as st
import os
from dotenv import load_dotenv
from text import select_text_from_pdf
import google.generativeai as genai
import re
import speech_recognition as sr 
import time
from google.api_core import retry
import json
from collections import Counter
import hashlib
import traceback
from PIL import Image
import io
import base64
import sys
import pytesseract
from PyPDF2 import PdfReader

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize session state for user performance
if 'user_performance' not in st.session_state:
    st.session_state.user_performance = {}

def get_pdf_hash(pdf_file):
    """Generate a unique hash for the PDF file."""
    pdf_hash = hashlib.md5(pdf_file.read()).hexdigest()
    pdf_file.seek(0)  # Reset file pointer after hashing
    return pdf_hash

def save_user_performance():
    """Save user performance data to a JSON file."""
    with open('user_performance.json', 'w') as f:
        json.dump(st.session_state.user_performance, f)

def load_user_performance():
    """Load user performance data from a JSON file."""
    try:
        with open('user_performance.json', 'r') as f:
            st.session_state.user_performance = json.load(f)
    except FileNotFoundError:
        st.session_state.user_performance = {}

def update_user_performance(pdf_hash, question, topic, is_correct):
    """Update the performance metrics for a user based on question correctness."""
    if pdf_hash not in st.session_state.user_performance:
        st.session_state.user_performance[pdf_hash] = {}
    if topic not in st.session_state.user_performance[pdf_hash]:
        st.session_state.user_performance[pdf_hash][topic] = {'correct': 0, 'total': 0}
    st.session_state.user_performance[pdf_hash][topic]['total'] += 1
    if is_correct:
        st.session_state.user_performance[pdf_hash][topic]['correct'] += 1
    save_user_performance()

def get_weak_topics(pdf_hash, n=3):
    """Return the n weakest topics based on user performance."""
    if pdf_hash not in st.session_state.user_performance:
        return []
    topic_scores = {topic: data['correct'] / data['total'] 
                    for topic, data in st.session_state.user_performance[pdf_hash].items()}
    return sorted(topic_scores, key=topic_scores.get)[:n]

@retry.Retry(predicate=retry.if_exception_type(Exception))
def generate_content_with_retry(model, prompt, max_retries=3, delay=5):
    """Retry mechanism for making API calls to the Google Gemini model."""
    for attempt in range(max_retries):
        try:
            return model.generate_content(prompt)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            st.warning(f"API call failed. Retrying in {delay} seconds... (Attempt {attempt + 1}/{max_retries})")
            time.sleep(delay)

def check_api_key():
    """Validate the Google API key by making a test API call."""
    try:
        model = genai.GenerativeModel('gemini-pro')
        generate_content_with_retry(model, "Test")
        return True
    except Exception as e:
        st.error(f"API key validation failed: {str(e)}")
        return False

def speech_to_text():
    """Convert speech input to text using Google Speech Recognition."""
    r = sr.Recognizer()
    with sr.Microphone() as source:
        st.write("Speak your answer...")
        audio = r.listen(source)
        st.write("Processing speech...")

    try:
        text = r.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        st.error("Sorry, I couldn't understand that.")
        return ""
    except sr.RequestError:
        st.error("Sorry, there was an error processing your speech.")
        return ""

def extract_score(evaluation_text):
    """Extract the score from the evaluation text."""
    score_pattern = r'Score:\s*(\d+(?:\.\d+)?)\s*(?:out of|\/)\s*10'
    match = re.search(score_pattern, evaluation_text, re.IGNORECASE)
    if match:
        return float(match.group(1))
    else:
        st.warning(f"Couldn't extract score from evaluation. Using default score of 5.")
        return 5.0  # Default score if we can't extract it

# Function to extract handwritten text from an image
def extract_handwritten_text(image):
    # Convert the image to grayscale (to improve OCR accuracy)
    image = image.convert('L')
    # Use Tesseract OCR to extract text
    text = pytesseract.image_to_string(image, config='--psm 6')  # --psm 6 is for sparse text
    return text

# Streamlit app to upload images of handwritten answers
def handwritten_answer_submission():
    st.title("Handwritten Answer Submission")
    
    # Allow user to upload an image file (photo of handwritten answer)
    uploaded_image = st.file_uploader("Upload an image of your handwritten answer", type=["png", "jpg", "jpeg"])
    
    if uploaded_image is not None:
        # Open the uploaded image
        image = Image.open(uploaded_image)
        
        # Display the uploaded image
        st.image(image, caption="Uploaded Image", use_column_width=True)
        
        # Extract and display the handwritten text
        with st.spinner("Extracting text..."):
            extracted_text = extract_handwritten_text(image)
            if extracted_text.strip():
                st.success("Text extracted from image:")
                st.text(extracted_text)
            else:
                st.warning("No recognizable text found in the image.")


def main():
    load_user_performance()

    st.set_page_config(page_title="Quizz.io", page_icon="📝", layout="wide")

    if "questions_generated" not in st.session_state:
        st.session_state["questions_generated"] = False

    if not st.session_state["questions_generated"]:
        st.title("Quizz.io")

        pdf_file = st.file_uploader("Upload a PDF file", type=["pdf"])
        num_questions = st.number_input("Enter the number of questions", min_value=1, value=3)
        difficulty_level = st.selectbox("Select difficulty level", ["Easy", "Medium", "Hard"])

        if pdf_file:
            pdf_hash = get_pdf_hash(pdf_file)
            st.session_state['current_pdf_hash'] = pdf_hash

        if st.button("Generate Questions 🚀"):
            st.write("Debug: Generate Questions button clicked")
            if pdf_file and num_questions and difficulty_level:
                if not check_api_key():
                    st.error("Please check your API key and try again.")
                else:
                    pdf_file_path = pdf_file.name
                    with open(pdf_file_path, "wb") as f:
                        f.write(pdf_file.getbuffer())

                    st.write("Debug: Calling generate_long_answer_questions")
                    questions, hints, expected_answers, topics = generate_long_answer_questions(pdf_file_path, pdf_hash, difficulty_level, num_questions)
                    
                    if questions:
                        # Ensure we have the correct number of questions, hints, answers, and topics
                        min_length = min(len(questions), len(hints), len(expected_answers), len(topics))
                        questions = questions[:min_length]
                        hints = hints[:min_length]
                        expected_answers = expected_answers[:min_length]
                        topics = topics[:min_length]

                        st.session_state["questions"] = questions
                        st.session_state["hints"] = hints
                        st.session_state["expected_answers"] = expected_answers
                        st.session_state["topics"] = topics
                        st.session_state["user_answers"] = [None] * len(questions)
                        st.session_state["questions_generated"] = True
                        st.success(f"Generated {len(questions)} questions. You can now answer them below.")
                    else:
                        st.error("No questions were generated. Please try again or check the PDF content.")
            
        st.write("Upload your handwritten answer (in image format):")
        handwritten_image = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])

        if handwritten_image is not None:
            # Process the uploaded image
            st.image(handwritten_image, caption='Uploaded Handwritten Answer', use_column_width=True)
            # Here, you can add further processing for the uploaded image if needed.


    if st.session_state.get("questions_generated", False):
        st.title("📝 Long Answer Questions")
        for i, (question, hint, expected_answer, topic) in enumerate(zip(st.session_state["questions"], st.session_state["hints"], st.session_state["expected_answers"], st.session_state["topics"]), start=1):
            st.markdown(f'<div style="color: white;"><b>Question No. {i}:</b></div>', unsafe_allow_html=True)
            st.write(question)
            
            if st.button(f"Show Hint for Question {i}", key=f"hint_button_{i}"):
                st.write("**Hint:**", hint)
            
            if st.button(f"Speak Answer for Question {i}"):
                user_answer = speech_to_text()
                st.session_state[f"question_{i}"] = user_answer
            
            user_answer = st.text_area("Your Answer:", value=st.session_state.get(f"question_{i}", ""), key=f"question_{i}")
            st.session_state["user_answers"][i-1] = user_answer

        if st.button("Submit"):
            pdf_hash = st.session_state.get('current_pdf_hash')
            for i, (user_answer, question, expected_answer, topic) in enumerate(zip(st.session_state["user_answers"], st.session_state["questions"], st.session_state["expected_answers"], st.session_state["topics"]), start=1):
                if user_answer.strip():
                    evaluation = evaluate_answer_with_gemini(user_answer, expected_answer)
                    score = extract_score(evaluation)
                    is_correct = score >= 7  # Answers with score 7 or above are correct
                    update_user_performance(pdf_hash, question, topic, is_correct)

                    st.write(f"Score: {score}/10")
                    if is_correct:
                        st.success("Well done! Your answer is correct.")
                    else:
                        st.warning("Your answer needs improvement. Review the expected answer and try again.")

    if st.button("Back to Home"):
        st.session_state.clear()
        st.session_state["questions_generated"] = False
        st.rerun()

def evaluate_answer_with_gemini(user_answer, expected_answer):
    """Evaluate the user's answer using the Gemini API."""
    prompt = f"""Compare the following user answer with the expected answer:

User Answer: {user_answer}

Expected Answer: {expected_answer}

Evaluate the user's answer for accuracy, completeness, and clarity. Provide a brief assessment and a score out of 10. 
Your response should always include a line starting with 'Score: ' followed by the numeric score out of 10.
"""
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(prompt)
    return response.text

def extract_text_and_images_from_pdf(pdf_path):
    """Extract text and images from a PDF file."""
    text = ""
    images = []
    try:
        # Open the PDF file and use PdfReader instead of PdfFileReader
        with open(pdf_path, 'rb') as pdf_file:
            reader = PdfReader(pdf_file)
            for page_num, page in enumerate(reader.pages):
                # Extract text from each page
                text += page.extract_text() if page.extract_text() else ""

                # Extract images if available
                if '/XObject' in page['/Resources']:
                    xObject = page['/Resources']['/XObject'].get_object()
                    for obj in xObject:
                        if xObject[obj]['/Subtype'] == '/Image':
                            try:
                                data = xObject[obj]._data
                                image = Image.open(io.BytesIO(data))
                                images.append(image)
                            except IOError:
                                st.warning(f"Warning: Could not identify image on page {page_num+1}.")
    except Exception as e:
        st.error(f"Error extracting text/images from PDF: {str(e)}")
    return text, images

def generate_long_answer_questions(pdf_path, pdf_hash, difficulty_level, num_questions):
    """Generate long answer questions using the Gemini API."""
    try:
        text, images = extract_text_and_images_from_pdf(pdf_path)

        prompt = f"""Extract topics and generate {num_questions} long-answer questions based on the following PDF content:
        
        {text}

        Each question should be relevant to a topic in the PDF and include a hint and expected answer. Ensure the questions vary in difficulty level, matching '{difficulty_level}'. Format the response as follows:
        - Question: 
        - Hint: 
        - Expected Answer: 
        - Topic: """

        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        raw_output = response.text

        # Extract questions, hints, expected answers, and topics from the response
        questions = re.findall(r'Question:\s*(.+)', raw_output)
        hints = re.findall(r'Hint:\s*(.+)', raw_output)
        expected_answers = re.findall(r'Expected Answer:\s*(.+)', raw_output)
        topics = re.findall(r'Topic:\s*(.+)', raw_output)

        return questions, hints, expected_answers, topics
    except Exception as e:
        st.error(f"Error generating questions: {str(e)}")
        return [], [], [], []

if __name__ == "__main__":
    main()

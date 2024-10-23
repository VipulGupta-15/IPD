import streamlit as st
import os
from dotenv import load_dotenv
import google.generativeai as genai
import re
import json
import hashlib
import time
from google.api_core import retry

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

def update_user_performance(pdf_hash, question, is_correct):
    """Update the performance metrics for a user based on question correctness."""
    if pdf_hash not in st.session_state.user_performance:
        st.session_state.user_performance[pdf_hash] = {'correct': 0, 'total': 0}
    st.session_state.user_performance[pdf_hash]['total'] += 1
    if is_correct:
        st.session_state.user_performance[pdf_hash]['correct'] += 1
    save_user_performance()

def get_weak_topics(pdf_hash, n=3):
    """Return the n weakest topics based on user performance."""
    if pdf_hash not in st.session_state.user_performance:
        return []
    return st.session_state.user_performance[pdf_hash]['total'] - st.session_state.user_performance[pdf_hash]['correct']

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

def extract_score(evaluation_text):
    """Extract the score from the evaluation text."""
    score_pattern = r'Score:\s*(\d+(?:\.\d+)?)\s*(?:out of|\/)\s*10'
    match = re.search(score_pattern, evaluation_text, re.IGNORECASE)
    if match:
        return float(match.group(1))
    else:
        st.warning(f"Couldn't extract score from evaluation. Using default score of 5.")
        return 5.0  # Default score if we can't extract it

def main():
    load_user_performance()
    st.set_page_config(page_title="Numerical Quiz Generator", page_icon="📝", layout="wide")

    if "questions_generated" not in st.session_state:
        st.session_state["questions_generated"] = False

    if not st.session_state["questions_generated"]:
        st.title("Numerical Quiz Generator")

        pdf_file = st.file_uploader("Upload a PDF file", type=["pdf"])
        num_questions = st.number_input("Enter the number of questions", min_value=1, value=3)
        difficulty_level = st.selectbox("Select difficulty level", ["Easy", "Medium", "Hard"])

        if pdf_file:
            pdf_hash = get_pdf_hash(pdf_file)
            st.session_state['current_pdf_hash'] = pdf_hash

        if st.button("Generate Numerical Questions 🚀"):
            if pdf_file and num_questions and difficulty_level:
                if not check_api_key():
                    st.error("Please check your API key and try again.")
                else:
                    pdf_file_path = pdf_file.name
                    with open(pdf_file_path, "wb") as f:
                        f.write(pdf_file.getbuffer())

                    questions, expected_answers = generate_numerical_questions(pdf_file_path, pdf_hash, difficulty_level, num_questions)
                    
                    if questions:
                        st.session_state["questions"] = questions
                        st.session_state["expected_answers"] = expected_answers
                        st.session_state["user_answers"] = [None] * len(questions)
                        st.session_state["questions_generated"] = True
                        st.success(f"Generated {len(questions)} numerical questions. You can now answer them below.")
                    else:
                        st.error("No questions were generated. Please try again or check the PDF content.")

    if st.session_state.get("questions_generated", False):
        st.title("📝 Numerical Questions")
        for i, (question, expected_answer) in enumerate(zip(st.session_state["questions"], st.session_state["expected_answers"]), start=1):
            st.markdown(f'<div style="color: white;"><b>Question No. {i}:</b></div>', unsafe_allow_html=True)
            st.write(question)

            user_answer = st.number_input("Your Answer:", value=st.session_state.get(f"question_{i}", 0), key=f"question_{i}")
            st.session_state["user_answers"][i-1] = user_answer

        if st.button("Submit"):
            pdf_hash = st.session_state.get('current_pdf_hash')
            for i, (user_answer, expected_answer) in enumerate(zip(st.session_state["user_answers"], st.session_state["questions"]), start=1):
                if user_answer is not None:
                    is_correct = user_answer == expected_answer  # Check if the user's answer matches the expected answer
                    update_user_performance(pdf_hash, question, is_correct)

                    st.write(f"Your Answer: {user_answer} | Expected Answer: {expected_answer}")
                    if is_correct:
                        st.success("Well done! Your answer is correct.")
                    else:
                        st.warning("Your answer is incorrect. Please review the expected answer.")

    if st.button("Back to Home"):
        st.session_state.clear()
        st.session_state["questions_generated"] = False
        st.rerun()

def generate_numerical_questions(pdf_path, pdf_hash, difficulty_level, num_questions):
    """Generate numerical questions using the Gemini API."""
    try:
        prompt = f"""Generate {num_questions} numerical questions based on the content of the following PDF. 
        Ensure that the questions vary in difficulty level, matching '{difficulty_level}'. 
        Format the response as follows:
        - Question: 
        - Expected Answer: """

        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        raw_output = response.text

        # Extract questions and expected answers from the response
        questions = re.findall(r'Question:\s*(.+)', raw_output)
        expected_answers = re.findall(r'Expected Answer:\s*(.+)', raw_output)

        return questions, expected_answers
    except Exception as e:
        st.error(f"Error generating questions: {str(e)}")
        return [], []

if __name__ == "__main__":
    main()

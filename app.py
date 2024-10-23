import streamlit as st
import os
from dotenv import load_dotenv
import google.generativeai as genai
import re
import json
import time
from google.api_core import retry
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize session state for user performance
if 'user_performance' not in st.session_state:
    st.session_state.user_performance = {}

def save_user_performance():
    with open('user_performance.json', 'w') as f:
        json.dump(st.session_state.user_performance, f)

def load_user_performance():
    try:
        with open('user_performance.json', 'r') as f:
            data = json.load(f)
            for key in data:
                if 'total' not in data[key]:
                    data[key]['total'] = 0
                if 'correct' not in data[key]:
                    data[key]['correct'] = 0
            st.session_state.user_performance = data
    except FileNotFoundError:
        st.session_state.user_performance = {}

def update_user_performance(subject, question_type, is_correct):
    key = f"{subject}_{question_type}"
    if key not in st.session_state.user_performance:
        st.session_state.user_performance[key] = {
            'correct': 0,
            'total': 0,
            'subject': subject,
            'type': question_type
        }
    
    st.session_state.user_performance[key]['total'] += 1
    if is_correct:
        st.session_state.user_performance[key]['correct'] += 1
    save_user_performance()

def plot_performance():
    """Generate performance visualization using plotly."""
    if not st.session_state.user_performance:
        return None
    
    data = []
    for key, stats in st.session_state.user_performance.items():
        if stats['total'] > 0:
            accuracy = (stats['correct'] / stats['total']) * 100
            data.append({
                'Subject': stats['subject'],
                'Type': stats['type'],
                'Accuracy': accuracy,
                'Correct': stats['correct'],
                'Total': stats['total']
            })
    
    if not data:
        return None
        
    df = pd.DataFrame(data)
    
    # Create a bar chart for accuracy
    fig = px.bar(
        df,
        x='Subject',
        y='Accuracy',
        color='Type',
        barmode='group',
        title='Performance by Subject and Question Type',
        labels={'Accuracy': 'Accuracy (%)', 'Subject': 'Subject'}
    )
    
    return fig

@retry.Retry(predicate=retry.if_exception_type(Exception))
def generate_content_with_retry(model, prompt, max_retries=3, delay=5):
    for attempt in range(max_retries):
        try:
            return model.generate_content(prompt)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            st.warning(f"API call failed. Retrying in {delay} seconds... (Attempt {attempt + 1}/{max_retries})")
            time.sleep(delay)

def check_api_key():
    try:
        model = genai.GenerativeModel('gemini-pro')
        generate_content_with_retry(model, "Test")
        return True
    except Exception as e:
        st.error(f"API key validation failed: {str(e)}")
        return False

def parse_mcq_response(raw_output):
    questions = []
    question_pattern = r'Q:?\s*(.+?)(?=(?:\nA\)|$))'
    options_pattern = r'([A-D]\)[\s\S]+?)(?=(?:[A-D]\)|Correct Answer:|Hint:|$))'
    answer_pattern = r'Correct Answer:\s*([A-D])'
    hint_pattern = r'Hint:\s*(.+?)(?=(?:\n\nQ|$))'
    
    question_blocks = raw_output.split('\n\n')
    
    for block in question_blocks:
        if not block.strip():
            continue
            
        try:
            question_match = re.search(question_pattern, block, re.DOTALL)
            if not question_match:
                continue
                
            question_text = question_match.group(1).strip()
            
            options = re.findall(options_pattern, block, re.DOTALL)
            if len(options) != 4:
                continue
                
            answer_match = re.search(answer_pattern, block)
            if not answer_match:
                continue
                
            correct_answer = answer_match.group(1).strip()
            
            # Extract hint if available
            hint_match = re.search(hint_pattern, block, re.DOTALL)
            hint = hint_match.group(1).strip() if hint_match else "No hint available"
            
            question_dict = {
                'question': question_text,
                'options': [opt.strip() for opt in options],
                'correct_answer': correct_answer,
                'hint': hint
            }
            
            questions.append(question_dict)
            
        except Exception as e:
            st.warning(f"Skipped a malformed question: {str(e)}")
            continue
    
    return questions

def parse_numerical_response(raw_output):
    questions = []
    current_question = {}
    
    lines = raw_output.split('\n')
    for line in lines:
        line = line.strip()
        if line.startswith('Q'):
            if current_question:
                questions.append(current_question)
            current_question = {
                'question': line.split(':', 1)[1].strip(),
                'answer': None,
                'options': [],
                'hint': None
            }
        elif line.startswith('Answer:'):
            try:
                current_question['answer'] = float(line.split(':', 1)[1].strip())
            except ValueError:
                continue
        elif line.startswith('Options:'):
            options_text = line.split(':', 1)[1].strip()
            current_question['options'] = [float(x.strip()) for x in options_text.split(',')]
        elif line.startswith('Hint:'):
            current_question['hint'] = line.split(':', 1)[1].strip()
    
    if current_question and current_question['answer'] is not None:
        questions.append(current_question)
    
    return questions

def generate_questions(subject, difficulty_level, num_questions, question_type):
    try:
        if question_type == "MCQ":
            prompt = f"""Generate exactly {num_questions} GATE exam style multiple choice questions for the subject '{subject}' at {difficulty_level} difficulty level.

For each question, strictly follow this format:

Q: [Write the question text here]
A) [First option]
B) [Second option]
C) [Third option]
D) [Fourth option]
Correct Answer: [Write only A or B or C or D]
Hint: [Provide a helpful hint without giving away the answer]

Important:
- Each question must have exactly 4 options (A, B, C, D)
- Correct Answer must be one of: A, B, C, or D
- Include a hint that helps understand the concept without revealing the answer
- Make sure the questions are like actual GATE exam questions
- Leave a blank line between questions
- Do not include any explanations or additional text"""
        else:
            prompt = f"""Generate exactly {num_questions} GATE exam style numerical questions for the subject '{subject}' at {difficulty_level} difficulty level.

For each question, strictly follow this format:

Q: [Question text with all necessary information]
Answer: [Single numerical value]
Options: [Four numerical options separated by commas, including the correct answer]
Hint: [Provide a helpful hint without giving away the answer]

Important:
- Each answer must be a single number
- Provide exactly 4 numerical options, with the correct answer being one of them
- Include a hint that helps solve the problem without giving away the answer
- Do not include units in the answer
- Leave a blank line between questions
- Make questions similar to actual GATE numerical problems"""

        model = genai.GenerativeModel('gemini-pro')
        response = generate_content_with_retry(model, prompt)
        
        if question_type == "MCQ":
            questions = parse_mcq_response(response.text)
        else:
            questions = parse_numerical_response(response.text)
            
        if not questions:
            st.error("Failed to generate valid questions. Response format was incorrect.")
            st.write("Raw response for debugging:")
            st.code(response.text)
            return []
            
        return questions

    except Exception as e:
        st.error(f"Error generating questions: {str(e)}")
        return []

def main():
    load_user_performance()
    st.set_page_config(page_title="GATE Exam Question Generator", page_icon="📝", layout="wide")

    if "questions_generated" not in st.session_state:
        st.session_state["questions_generated"] = False

    if not st.session_state["questions_generated"]:
        st.title("GATE Exam Question Generator")

        subject = st.selectbox("Select a subject", [
            "Engineering Mathematics",
            "Digital Logic",
            "Computer Organization and Architecture",
            "Programming and Data Structures",
            "Algorithms",
            "Theory of Computation",
            "Compiler Design",
            "Operating Systems",
            "Databases",
            "Computer Networks"
        ])
        
        question_type = st.selectbox("Select question type", ["MCQ", "Numerical"])
        num_questions = st.number_input("Number of questions", min_value=1, value=3)
        difficulty_level = st.selectbox("Select difficulty level", ["Easy", "Medium", "Hard"])

        if st.button("Generate Questions 🚀"):
            if not check_api_key():
                st.error("Please check your API key and try again.")
            else:
                with st.spinner("Generating questions..."):
                    questions = generate_questions(subject, difficulty_level, num_questions, question_type)
                
                if questions:
                    st.session_state["questions"] = questions
                    st.session_state["question_type"] = question_type
                    st.session_state["subject"] = subject
                    st.session_state["questions_generated"] = True
                    st.success(f"Generated {len(questions)} questions. Start solving below!")
                else:
                    st.error("No questions were generated. Please try again.")

    if st.session_state.get("questions_generated", False):
        st.title("📝 GATE Exam Questions")
        question_type = st.session_state["question_type"]
        subject = st.session_state["subject"]
        
        for i, question in enumerate(st.session_state["questions"], 1):
            st.markdown(f'### Question {i}')
            st.write(question['question'])
            
            # Add a collapsible section for hints
            with st.expander("Show Hint 💡"):
                st.write(question.get('hint', 'No hint available'))
            
            if question_type == "MCQ":
                options = question['options']
                user_answer = st.radio(f"Select your answer for Question {i}:", 
                                     ['A', 'B', 'C', 'D'],
                                     key=f"q_{i}")
                
                # Display options
                for option in options:
                    st.write(option)
                    
            else:  # Numerical
                # Display options as radio buttons
                options = question.get('options', [])
                if options:
                    user_answer = st.radio(f"Select your answer for Question {i}:",
                                         options,
                                         key=f"q_{i}")
                else:
                    user_answer = st.number_input(f"Enter your numerical answer for Question {i}:",
                                                value=0.0,
                                                step=0.1,
                                                key=f"q_{i}")

        if st.button("Submit"):
            total_correct = 0
            
            for i, question in enumerate(st.session_state["questions"], 1):
                user_ans = st.session_state[f"q_{i}"]
                
                if question_type == "MCQ":
                    is_correct = user_ans == question['correct_answer']
                    st.write(f"Question {i}:")
                    st.write(f"Your answer: {user_ans}")
                    st.write(f"Correct answer: {question['correct_answer']}")
                else:
                    correct_answer = float(question['answer'])
                    if isinstance(user_ans, float):
                        is_correct = abs(user_ans - correct_answer) < 0.1
                    else:
                        is_correct = abs(float(user_ans) - correct_answer) < 0.1
                    st.write(f"Question {i}:")
                    st.write(f"Your answer: {user_ans}")
                    st.write(f"Correct answer: {correct_answer}")
                
                if is_correct:
                    st.success("Correct! ✅")
                    total_correct += 1
                else:
                    st.error("Incorrect ❌")
                
                update_user_performance(subject, question_type, is_correct)
            
            st.markdown(f"### Final Score: {total_correct}/{len(st.session_state['questions'])}")
            
            # Display performance statistics and visualization
            st.markdown("### Your Performance Statistics")
            
            # Create and display the performance visualization
            fig = plot_performance()
            if fig:
                st.plotly_chart(fig, use_container_width=True)
            
            # Display detailed statistics
            for key, stats in st.session_state.user_performance.items():
                try:
                    if isinstance(stats, dict) and stats.get('total', 0) > 0:
                        accuracy = (stats.get('correct', 0) / stats['total']) * 100
                        subject = stats.get('subject', key.split('_')[0])
                        q_type = stats.get('type', key.split('_')[1])
                        st.write(f"{subject} ({q_type}): {accuracy:.1f}% ({stats['correct']}/{stats['total']})")
                except Exception as e:
                    st.warning(f"Error displaying stats for {key}: {str(e)}")

    if st.button("Start New Quiz"):
        st.session_state.clear()
        st.session_state["questions_generated"] = False
        st.rerun()

if __name__ == "__main__":
    main()
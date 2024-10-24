import streamlit as st
import os
from dotenv import load_dotenv
import google.generativeai as genai
import re
import json
import time
from google.api_core import retry
import pandas as pd

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize session state for user performance
if 'user_performance' not in st.session_state:
    st.session_state.user_performance = {}

# Define subject topics mapping
SUBJECT_TOPICS = {
    "Engineering Mathematics": [
        "Discrete Mathematics",
        "Linear Algebra",
        "Calculus",
        "Probability and Statistics",
        "Numerical Methods"
    ],
    "Digital Logic": [
        "Boolean Algebra",
        "Combinational Circuits",
        "Sequential Circuits",
        "Number Systems",
        "Logic Families"
    ],
    "Computer Organization and Architecture": [
        "Processor Architecture",
        "Memory Organization",
        "I/O Organization",
        "Pipelining",
        "Cache Memory"
    ],
    "Programming and Data Structures": [
        "Arrays and Strings",
        "Linked Lists",
        "Trees",
        "Stacks and Queues",
        "Hashing"
    ],
    "Algorithms": [
        "Sorting Algorithms",
        "Searching Algorithms",
        "Graph Algorithms",
        "Dynamic Programming",
        "Greedy Algorithms"
    ],
    "Theory of Computation": [
        "Regular Languages",
        "Context-Free Languages",
        "Turing Machines",
        "Computability",
        "Complexity Theory"
    ],
    "Compiler Design": [
        "Lexical Analysis",
        "Parsing",
        "Semantic Analysis",
        "Code Generation",
        "Code Optimization"
    ],
    "Operating Systems": [
        "Process Management",
        "Memory Management",
        "File Systems",
        "Deadlocks",
        "CPU Scheduling"
    ],
    "Databases": [
        "ER Model",
        "Normalization",
        "SQL",
        "Transaction Processing",
        "Concurrency Control"
    ],
    "Computer Networks": [
        "OSI Model",
        "TCP/IP Protocol",
        "Network Security",
        "Routing Algorithms",
        "Wireless Networks"
    ]
}

def save_user_performance():
    with open('user_performance.json', 'w') as f:
        json.dump(st.session_state.user_performance, f)

def load_user_performance():
    try:
        with open('user_performance.json', 'r') as f:
            data = json.load(f)
            st.session_state.user_performance = data
    except FileNotFoundError:
        st.session_state.user_performance = {}

def update_user_performance(subject, question_type, is_correct):
    key = f"{subject}_{question_type}"
    if key not in st.session_state.user_performance:
        st.session_state.user_performance[key] = {
            'correct': 0,
            'total': 0
        }
    
    st.session_state.user_performance[key]['total'] += 1
    if is_correct:
        st.session_state.user_performance[key]['correct'] += 1
    save_user_performance()

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
    options_pattern = r'([A-D]\)[\s\S]+?)(?=(?:[A-D]\)|Correct Answer:|Hint:|Explanation:|$))'
    answer_pattern = r'Correct Answer:\s*([A-D])'
    hint_pattern = r'Hint:\s*(.+?)(?=(?:\n\nQ|$))'
    explanation_pattern = r'Explanation:\s*(.+?)(?=(?:\n\nQ|$))'
    
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
            
            hint_match = re.search(hint_pattern, block, re.DOTALL)
            hint = hint_match.group(1).strip() if hint_match else "No hint available"

            explanation_match = re.search(explanation_pattern, block, re.DOTALL)
            explanation = explanation_match.group(1).strip() if explanation_match else "No explanation available"
            
            question_dict = {
                'question': question_text,
                'options': [opt.strip() for opt in options],
                'correct_answer': correct_answer,
                'hint': hint,
                'explanation': explanation
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

def generate_questions(subject, topics, difficulty_level, num_questions, question_type):
    try:
        topics_str = ", ".join(topics)
        if question_type == "MCQ":
            prompt = f"""Generate exactly {num_questions} GATE exam style multiple choice questions for the subject '{subject}' focusing on the following topics: {topics_str} at {difficulty_level} difficulty level.

For each question, strictly follow this format:

Q: [Write the question text here]
A) [First option]
B) [Second option]
C) [Third option]
D) [Fourth option]
Correct Answer: [Write only A or B or C or D]
Hint: [Provide a helpful hint without giving away the answer]
Explanation: [Provide a brief explanation of why the correct answer is correct]

Important:
- Each question must have exactly 4 options (A, B, C, D)
- Correct Answer must be one of: A, B, C, or D
- Include a hint that helps understand the concept without revealing the answer
- Include a brief explanation of the correct answer
- Make sure the questions are like actual GATE exam questions
- Leave a blank line between questions
- Do not include any explanations or additional text"""
        else:
            prompt = f"""Generate exactly {num_questions} GATE exam style numerical questions for the subject '{subject}' focusing on the following topics: {topics_str} at {difficulty_level} difficulty level.

For each question, strictly follow this format:

Q: [Question text with all necessary information]
Answer: [Single numerical value]
Options: [Four numerical options separated by commas, including the correct answer]
Hint: [Provide a helpful hint without giving away the answer]
Explanation: [Provide a brief explanation of why the correct answer is correct]

Important:
- Each answer must be a single number
- Provide exactly 4 numerical options, with the correct answer being one of them
- Include a hint that helps solve the problem without giving away the answer
- Include a brief explanation of the correct answer
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

        subject = st.selectbox("Select a subject", list(SUBJECT_TOPICS.keys()))
        
        # Multi-select for topics
        available_topics = SUBJECT_TOPICS[subject]
        selected_topics = st.multiselect(
            "Select topics (optional)",
            available_topics,
            default=available_topics[:2]  # Default to first two topics
        )
        
        question_type = st.selectbox("Select question type", ["MCQ", "Numerical"])
        num_questions = st.number_input("Number of questions", min_value=1, value=3)
        difficulty_level = st.selectbox("Select difficulty level", ["Easy", "Medium", "Hard"])

        if st.button("Generate Questions 🚀"):
            if not check_api_key():
                st.error("Please check your API key and try again.")
            else:
                if not selected_topics:
                    st.warning("Please select at least one topic.")
                else:
                    with st.spinner("Generating questions..."):
                        questions = generate_questions(subject, selected_topics, difficulty_level, num_questions, question_type)
                    
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
            
            with st.expander("Show Hint 💡"):
                st.write(question.get('hint', 'No hint available'))
            
            if question_type == "MCQ":
                options = question['options']
                user_answer = st.radio(
                    f"Select your answer for Question {i}:", 
                    ['', 'A', 'B', 'C', 'D'],
                    format_func=lambda x: 'Select an option' if x == '' else x,
                    key=f"q_{i}"
                )
                
                for option in options:
                    st.write(option)
                    
            else:  # Numerical
                options = question.get('options', [])
                if options:
                    options_with_empty = [None] + options
                    user_answer = st.radio(
                        f"Select your answer for Question {i}:",
                        options_with_empty,
                        format_func=lambda x: 'Select an option' if x is None else str(x),
                        key=f"q_{i}"
                    )
                else:
                    user_answer = st.number_input(
                        f"Enter your numerical answer for Question {i}:",
                        value=None,
                        step=0.1,
                        key=f"q_{i}"
                    )

        submitted = st.button("Submit")
        if submitted:
            all_answered = True
            for i in range(1, len(st.session_state["questions"]) + 1):
                if not st.session_state[f"q_{i}"] or st.session_state[f"q_{i}"] == '':
                    all_answered = False
                    break

            if not all_answered:
                st.error("Please answer all questions before submitting.")
            else:
                total_correct = 0
                
                for i, question in enumerate(st.session_state["questions"], 1):
                    user_ans = st.session_state[f"q_{i}"]
                    
                    if question_type == "MCQ":
                        is_correct = user_ans == question['correct_answer']
                        st.write(f"Question {i}:")
                        st.write(f"Your answer: {user_ans}")
                        st.write(f"Correct answer: {question['correct_answer']}")
                        st.write(f"Explanation: {question['explanation']}")
                    else:
                        correct_answer = float(question['answer'])
                        if isinstance(user_ans, float):
                            is_correct = abs(user_ans - correct_answer) < 0.1
                        else:
                            is_correct = abs(float(user_ans) - correct_answer) < 0.1
                        
                        st.write(f"Question {i}:")
                        st.write(f"Your answer: {user_ans}")
                        st.write(f"Correct answer: {correct_answer}")
                        st.write(f"Explanation: {question['explanation']}")
                    
                    if is_correct:
                        st.success("Correct! ✅")
                        total_correct += 1
                    else:
                        st.error("Incorrect ❌")
                    
                    update_user_performance(subject, question_type, is_correct)
                
                st.markdown(f"### Final Score: {total_correct}/{len(st.session_state['questions'])}")

    if st.button("Start New Quiz"):
        st.session_state.clear()
        st.session_state["questions_generated"] = False
        st.rerun()

if __name__ == "__main__":
    main()
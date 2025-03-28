from dotenv import load_dotenv
load_dotenv()
from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
from groq import Groq
import os
import json
import logging
from datetime import datetime
from pymongo import MongoClient
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt
from bson import ObjectId

# Minimal logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Adjust in production

# MongoDB setup
MONGO_DB_URI = os.getenv("MONGO_DB_URI")
client = MongoClient(MONGO_DB_URI)
db = client['mcq_generator']
users_collection = db['users']
tests_collection = db['tests']

# JWT setup
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET", "your_jwt_secret_key_here")
jwt = JWTManager(app)

def extract_text_from_pdf(pdf_path, max_chars=2000):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text("text") + "\n"
            if len(text) > max_chars:
                break
    return text[:max_chars]

def extract_json_from_response(raw_output):
    raw_output = raw_output.strip()
    start_idx = raw_output.find('[')
    end_idx = raw_output.rfind(']') + 1
    if start_idx == -1 or end_idx == 0:
        raise ValueError("No JSON array delimiters found")
    return json.loads(raw_output[start_idx:end_idx])

def generate_mcq(text, groq_api_key, num_questions=5, difficulty="medium"):
    client = Groq(api_key=groq_api_key)
    prompt = (
        f"Generate {num_questions} multiple-choice questions from the text below. "
        f"Difficulty: {difficulty} (easy: basic, medium: moderate, hard: complex). "
        f"Each question is a JSON object with: question (string), options (array of 4 strings), correct_answer (string), type (theory/numerical), difficulty (string). "
        f"Return a JSON array only.\n\nText:\n{text}"
    )
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",  # Lighter model for performance
        messages=[
            {"role": "system", "content": "You are an AI expert in question generation."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
    )
    raw_output = completion.choices[0].message.content
    mcq_output = extract_json_from_response(raw_output)
    if not isinstance(mcq_output, list):
        return {"error": "Response is not a JSON array"}
    required_fields = {"question", "options", "correct_answer", "type", "difficulty"}
    for mcq in mcq_output:
        if not all(field in mcq for field in required_fields) or len(mcq["options"]) != 4:
            return {"error": "Invalid MCQ format"}
    return mcq_output

@app.route('/api/generate-mcqs', methods=['POST'])
@jwt_required()
def generate_mcqs_endpoint():
    user_id = get_jwt_identity()
    logging.info(f"Request to /api/generate-mcqs by user: {user_id}")
    try:
        if 'pdf' not in request.files:
            return jsonify({'error': 'No PDF file provided'}), 400

        pdf_file = request.files['pdf']
        num_questions = request.form.get('num_questions', default=5, type=int)
        difficulty = request.form.get('difficulty', default='medium', type=str).lower()
        test_name = request.form.get('test_name', f"Test_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
        pdf_name = pdf_file.filename

        if not pdf_name.endswith('.pdf'):
            return jsonify({'error': 'Invalid file format'}), 400
        if num_questions < 1 or num_questions > 20:
            return jsonify({'error': 'Number of questions must be 1-20'}), 400
        if difficulty not in ['easy', 'medium', 'hard']:
            return jsonify({'error': 'Difficulty must be easy, medium, or hard'}), 400

        temp_path = f"temp_{pdf_name}"
        pdf_file.save(temp_path)
        groq_api_key = os.getenv("GROQ_API_KEY")
        extracted_text = extract_text_from_pdf(temp_path)
        mcqs = generate_mcq(extracted_text, groq_api_key, num_questions, difficulty)

        if os.path.exists(temp_path):
            os.remove(temp_path)

        if isinstance(mcqs, dict) and 'error' in mcqs:
            logging.error(f"MCQ generation error: {mcqs['error']}")
            return jsonify({'success': False, 'error': mcqs['error']}), 500

        test_data = {
            "user_id": user_id,
            "test_name": test_name,
            "pdf_name": pdf_name,
            "mcqs": mcqs,
            "created_at": datetime.utcnow().isoformat(),
            "status": "generated",
            "assigned_to": [],
            "start_time": None,
            "end_time": None,
            "result": {}
        }
        tests_collection.insert_one(test_data)
        logging.info(f"Response: Generated {len(mcqs)} MCQs for test {test_name}")
        return jsonify({'success': True, 'mcqs': mcqs, 'test_name': test_name, 'pdf_name': pdf_name}), 200
    except Exception as e:
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        logging.error(f"Error in /api/generate-mcqs: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/review-mcqs', methods=['GET'])
@jwt_required()
def review_mcqs():
    user_id = get_jwt_identity()
    test_name = request.args.get('test_name')
    logging.info(f"Request to /api/review-mcqs for test: {test_name} by user: {user_id}")
    if not test_name:
        return jsonify({'error': 'Test name required'}), 400

    test = tests_collection.find_one({"user_id": user_id, "test_name": test_name})
    if not test:
        return jsonify({'error': 'Test not found'}), 404

    logging.info(f"Response: Retrieved MCQs for test {test_name}")
    return jsonify({'test_name': test['test_name'], 'pdf_name': test['pdf_name'], 'mcqs': test['mcqs']}), 200

@app.route('/api/assign-test', methods=['POST'])
@jwt_required()
def assign_test():
    user_id = get_jwt_identity()
    data = request.get_json()
    logging.info(f"Request to /api/assign-test by user: {user_id}")
    test_name = data.get('test_name')
    student_ids = data.get('student_ids', [])
    start_time = data.get('start_time')
    end_time = data.get('end_time')

    if not all([test_name, student_ids, start_time, end_time]):
        return jsonify({'error': 'Missing required fields'}), 400

    test = tests_collection.find_one({"user_id": user_id, "test_name": test_name})
    if not test:
        return jsonify({'error': 'Test not found'}), 404

    valid_students = users_collection.find({"_id": {"$in": [ObjectId(sid) for sid in student_ids]}, "role": "student"})
    valid_student_ids = [str(student['_id']) for student in valid_students]
    if len(valid_student_ids) != len(student_ids):
        return jsonify({'error': 'Invalid student IDs'}), 400

    tests_collection.update_one(
        {"user_id": user_id, "test_name": test_name},
        {"$set": {"assigned_to": valid_student_ids, "start_time": start_time, "end_time": end_time, "status": "assigned"}}
    )
    logging.info(f"Response: Test {test_name} assigned to {len(valid_student_ids)} students")
    return jsonify({'message': 'Test assigned successfully'}), 200

@app.route('/api/manage-test', methods=['POST'])
@jwt_required()
def manage_test():
    user_id = get_jwt_identity()
    data = request.get_json()
    logging.info(f"Request to /api/manage-test by user: {user_id}")
    test_name = data.get('test_name')
    action = data.get('action')

    if not all([test_name, action]):
        return jsonify({'error': 'Missing required fields'}), 400

    test = tests_collection.find_one({"user_id": user_id, "test_name": test_name})
    if not test:
        return jsonify({'error': 'Test not found'}), 404

    if action == "start":
        tests_collection.update_one({"user_id": user_id, "test_name": test_name}, {"$set": {"status": "active"}})
        logging.info(f"Response: Test {test_name} started")
        return jsonify({'message': 'Test started'}), 200
    elif action == "stop":
        tests_collection.update_one({"user_id": user_id, "test_name": test_name}, {"$set": {"status": "stopped"}})
        logging.info(f"Response: Test {test_name} stopped")
        return jsonify({'message': 'Test stopped'}), 200
    elif action == "reassign":
        student_ids = data.get('student_ids', [])
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        if not all([student_ids, start_time, end_time]):
            return jsonify({'error': 'Missing fields for reassign'}), 400
        valid_students = users_collection.find({"_id": {"$in": [ObjectId(sid) for sid in student_ids]}, "role": "student"})
        valid_student_ids = [str(student['_id']) for student in valid_students]
        if len(valid_student_ids) != len(student_ids):
            return jsonify({'error': 'Invalid student IDs'}), 400
        tests_collection.update_one(
            {"user_id": user_id, "test_name": test_name},
            {"$set": {"assigned_to": valid_student_ids, "start_time": start_time, "end_time": end_time, "status": "assigned"}}
        )
        logging.info(f"Response: Test {test_name} reassigned")
        return jsonify({'message': 'Test reassigned'}), 200
    return jsonify({'error': 'Invalid action'}), 400

@app.route('/api/save-test-result', methods=['POST'])
@jwt_required()
def save_test_result():
    user_id = get_jwt_identity()
    data = request.get_json()
    logging.info(f"Request to /api/save-test-result by user: {user_id}")
    test_name = data.get('test_name')
    result = data.get('result')

    if not all([test_name, result]):
        return jsonify({"message": "Missing test_name or result"}), 400

    test = tests_collection.find_one({"test_name": test_name, "assigned_to": user_id})
    if not test:
        return jsonify({"message": "Test not found or not assigned"}), 404

    now = datetime.utcnow().isoformat()
    if test['status'] != "active" or now < test['start_time'] or now > test['end_time']:
        return jsonify({"message": "Test not active or time expired"}), 403

    tests_collection.update_one({"test_name": test_name}, {"$set": {f"result.{user_id}": result}})
    logging.info(f"Response: Result saved for test {test_name}")
    return jsonify({"message": "Test result saved"}), 200

@app.route('/api/user-tests', methods=['GET'])
@jwt_required()
def get_user_tests():
    user_id = get_jwt_identity()
    logging.info(f"Request to /api/user-tests by user: {user_id}")
    query = {"user_id": user_id}
    pdf_name = request.args.get('pdf_name')
    test_name = request.args.get('test_name')
    if pdf_name:
        query["pdf_name"] = pdf_name
    if test_name:
        query["test_name"] = test_name
    tests = list(tests_collection.find(query, {"_id": 0}))
    logging.info(f"Response: Retrieved {len(tests)} tests")
    return jsonify(tests), 200

@app.route('/api/student-results', methods=['GET'])
@jwt_required()
def get_student_results():
    user_id = get_jwt_identity()
    logging.info(f"Request to /api/student-results by user: {user_id}")
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user['role'] != 'teacher':
        return jsonify({'error': 'Only teachers can view results'}), 403

    test_name = request.args.get('test_name')
    if not test_name:
        return jsonify({'error': 'Test name required'}), 400

    test = tests_collection.find_one({"user_id": user_id, "test_name": test_name})
    if not test:
        return jsonify({'error': 'Test not found'}), 404

    logging.info(f"Response: Retrieved results for test {test_name}")
    return jsonify({'test_name': test_name, 'results': test.get('result', {})}), 200

@app.route('/api/students', methods=['GET'])
@jwt_required()
def get_students():
    user_id = get_jwt_identity()
    logging.info(f"Request to /api/students by user: {user_id}")
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user['role'] != 'teacher':
        return jsonify({'error': 'Only teachers can view students'}), 403

    students = list(users_collection.find({"role": "student"}, {"_id": 1, "name": 1, "email": 1}))
    response = [{**student, "_id": str(student["_id"])} for student in students]
    logging.info(f"Response: Retrieved {len(response)} students")
    return jsonify(response), 200

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    logging.info("Request to /api/auth/signup")
    name, email, password, role = data.get('name'), data.get('email'), data.get('password'), data.get('role')
    if not all([name, email, password, role]) or role not in ['teacher', 'student']:
        return jsonify({"message": "Missing or invalid fields"}), 400

    if users_collection.find_one({"email": email, "role": role}):
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user = {"name": name, "email": email, "password": hashed_password, "role": role}
    result = users_collection.insert_one(user)
    access_token = create_access_token(identity=str(result.inserted_id))
    logging.info(f"Response: User {email} signed up as {role}")
    return jsonify({"message": "Account created", "token": access_token, "role": role}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    logging.info("Request to /api/auth/login")
    email, password, role = data.get('email'), data.get('password'), data.get('role')
    if not all([email, password, role]) or role not in ['teacher', 'student']:
        return jsonify({"message": "Missing or invalid fields"}), 400

    user = users_collection.find_one({"email": email, "role": role})
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        access_token = create_access_token(identity=str(user['_id']))
        logging.info(f"Response: User {email} logged in as {role}")
        return jsonify({"message": "Logged in", "token": access_token, "role": user['role']}), 200
    return jsonify({"message": "Invalid credentials"}), 401

if __name__ == '__main__':
    logging.info("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5001)
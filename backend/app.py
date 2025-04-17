from dotenv import load_dotenv
load_dotenv()
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import fitz  # PyMuPDF
from groq import Groq
import os
import json
import logging
from pymongo import MongoClient
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt
from bson import ObjectId
from bson.errors import InvalidId
import random
import csv
import io
from pytz import timezone
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)

app = Flask(__name__)
CORS(app, 
     resources={r"/*": {
         "origins": ["http://localhost:8080", "http://localhost:4040", "http://localhost:3000","https://8053-58-146-106-120.ngrok-free.app"],
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
         "expose_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True,
         "max_age": 3600
     }},
     supports_credentials=True)

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in ["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"]:
        response.headers.add('Access-Control-Allow-Origin', origin)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# MongoDB setup
MONGO_DB_URI = os.getenv("MONGO_DB_URI")
if not MONGO_DB_URI:
    raise ValueError("MONGO_DB_URI is not set in the environment")
client = MongoClient(MONGO_DB_URI)
db = client['mcq_generator']
users_collection = db['users']
tests_collection = db['tests']

# JWT setup
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
if not app.config['JWT_SECRET_KEY']:
    raise ValueError("JWT_SECRET_KEY is not set in the environment")
jwt = JWTManager(app)

# IST Timezone
IST = timezone('Asia/Kolkata')

# Scheduler setup for automatic test status updates
scheduler = BackgroundScheduler()
scheduler.start()

def update_test_status():
    """Background task to update test statuses based on IST time."""
    now = datetime.now(IST).isoformat()
    tests = tests_collection.find({"status": {"$in": ["assigned", "active"]}})
    for test in tests:
        start_time = test.get("start_time")
        end_time = test.get("end_time")
        if not start_time or not end_time:
            continue
        if now >= start_time and now <= end_time and test["status"] != "active":
            tests_collection.update_one(
                {"_id": test["_id"]},
                {"$set": {"status": "active"}}
            )
            logging.info(f"Test {test['test_name']} auto-set to active")
        elif now > end_time and test["status"] != "stopped":
            tests_collection.update_one(
                {"_id": test["_id"]},
                {"$set": {"status": "stopped"}}
            )
            logging.info(f"Test {test['test_name']} auto-set to stopped")

# Schedule status updates every minute
scheduler.add_job(update_test_status, 'interval', minutes=1)

# Utility Functions
def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file."""
    text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text("text") + "\n"
        logging.info(f"Extracted {len(text)} characters from PDF: {pdf_path}")
        return text
    except Exception as e:
        logging.error(f"PDF extraction failed: {str(e)}")
        raise

def split_text_into_chunks(text, max_chars=5000):
    """Split text into chunks of approximately max_chars."""
    return [text[i:i + max_chars] for i in range(0, len(text), max_chars)]

def extract_json_from_response(raw_output):
    """Extract JSON array from raw AI response."""
    raw_output = raw_output.strip()
    start_idx = raw_output.find('[')
    end_idx = raw_output.rfind(']') + 1
    if start_idx == -1 or end_idx == 0:
        raise ValueError("No JSON array delimiters found")
    return json.loads(raw_output[start_idx:end_idx])

def generate_mcq_with_relevance(text, groq_api_key, num_questions=2, difficulty="medium"):
    """Generate MCQs from text using Groq API."""
    try:
        client = Groq(api_key=groq_api_key)
        difficulty_instructions = {
            "easy": "For easy difficulty, generate straightforward and concise questions that test basic recall or understanding of key terms or concepts. Use clear and distinct options with obviously incorrect distractors.",
            "medium": "For medium difficulty, generate questions that require some analysis or application of concepts. Include plausible distractors that might reflect common mistakes.",
            "hard": "For hard difficulty, generate complex questions that demand deep understanding, synthesis of multiple concepts, or complex problem-solving. Use very plausible distractors that require careful consideration."
        }
        instruction = difficulty_instructions.get(difficulty, "")
        prompt = (
            f"Generate {num_questions} multiple-choice questions from the text below. "
            f"{instruction} "
            f"Questions must be relevant to the subject and usable in an examination. "
            f"Choose the type ('theory' or 'numerical') based on the content: use 'numerical' for questions involving calculations or mathematical concepts, and 'theory' otherwise. "
            f"Set the 'difficulty' field to '{difficulty}' for each question. "
            f"Each question should be a JSON object with: question (string), options (array of 4 strings), "
            f"correct_answer (string), type (theory/numerical), difficulty (string), "
            f"relevance_score (float between 0 and 1, where 1 is highly relevant). "
            f"Return a JSON array only.\n\nText:\n{text}"
        )
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {"role": "system", "content": "You are an AI expert in question generation."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_completion_tokens=1024,
            top_p=1,
            stream=False,
        )
        raw_output = completion.choices[0].message.content if completion.choices else None
        if not raw_output:
            return {"error": "No valid response from AI model"}
        logging.info(f"Raw Grok response: {raw_output[:100]}...")
        mcq_output = extract_json_from_response(raw_output)
        if not isinstance(mcq_output, list):
            return {"error": "Response is not a JSON array"}
        required_fields = {"question", "options", "correct_answer", "type", "difficulty", "relevance_score"}
        for mcq in mcq_output:
            if not all(field in mcq for field in required_fields) or len(mcq["options"]) != 4:
                return {"error": "Invalid MCQ format"}
            if not (0 <= mcq["relevance_score"] <= 1):
                return {"error": "Relevance score must be between 0 and 1"}
        return mcq_output
    except Exception as e:
        logging.error(f"MCQ generation failed: {str(e)}")
        return {"error": str(e)}

def generate_mcqs_from_random_chunks(text, groq_api_key, num_questions, difficulty, min_relevance=0.7):
    """Generate MCQs by sampling random chunks."""
    chunks = split_text_into_chunks(text)
    if not chunks:
        return {"error": "No text chunks available"}
    
    all_mcqs = []
    attempted_chunks = set()
    chunk_size = 2

    while len(all_mcqs) < num_questions and len(attempted_chunks) < len(chunks):
        remaining_chunks = [i for i in range(len(chunks)) if i not in attempted_chunks]
        if not remaining_chunks:
            break
        chunk_idx = random.choice(remaining_chunks)
        attempted_chunks.add(chunk_idx)
        chunk_text = chunks[chunk_idx]

        mcqs = generate_mcq_with_relevance(chunk_text, groq_api_key, chunk_size, difficulty)
        if isinstance(mcqs, dict) and 'error' in mcqs:
            logging.warning(f"Skipping chunk {chunk_idx} due to error: {mcqs['error']}")
            continue
        
        relevant_mcqs = [mcq for mcq in mcqs if mcq["relevance_score"] >= min_relevance]
        all_mcqs.extend(relevant_mcqs)
        logging.info(f"Generated {len(relevant_mcqs)} relevant MCQs from chunk {chunk_idx}")

    all_mcqs.sort(key=lambda x: x["relevance_score"], reverse=True)
    return all_mcqs[:num_questions]

# Authentication Endpoints
@app.route('/api/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        role = data.get('role', '').strip()

        if not name:
            return jsonify({"error": "Name is required"}), 400
        if not email:
            return jsonify({"error": "Email is required"}), 400
        if not password:
            return jsonify({"error": "Password is required"}), 400
        if not role:
            return jsonify({"error": "Role is required"}), 400
        if role not in ['teacher', 'student']:
            return jsonify({"error": "Invalid role"}), 400

        if users_collection.find_one({"email": email}):
            return jsonify({"error": "Email already registered"}), 409

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "role": role,
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = users_collection.insert_one(user)
        access_token = create_access_token(identity=str(result.inserted_id))
        
        logging.info(f"User created successfully: {email}")
        
        return jsonify({
            "message": "Account created successfully",
            "token": access_token,
            "user": {
                "id": str(result.inserted_id),
                "name": name,
                "email": email,
                "role": role
            }
        }), 201
        
    except Exception as e:
        logging.error(f"Signup error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json()
    email, password = data.get('email'), data.get('password')
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    user = users_collection.find_one({"email": email})
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({"error": "Invalid credentials"}), 401
    access_token = create_access_token(identity=str(user['_id']))
    return jsonify({
        "user": {"id": str(user['_id']), "name": user['name'], "email": user['email'], "role": user['role']},
        "token": access_token
    }), 200

@app.route('/api/check-auth', methods=['GET', 'OPTIONS'])
@jwt_required()
def check_auth():
    if request.method == 'OPTIONS':
        return '', 204
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"authenticated": False, "message": "User not found"}), 401
    return jsonify({
        "authenticated": True,
        "user": {"id": str(user["_id"]), "name": user["name"], "email": user["email"], "role": user["role"]}
    }), 200

@app.route('/api/cleanup-pdf', methods=['POST'])
@jwt_required()
def cleanup_pdf():
    user_id = get_jwt_identity()
    data = request.get_json()
    pdf_path = data.get('pdf_path')
    if pdf_path and os.path.exists(pdf_path):
        os.remove(pdf_path)
        logging.info(f"Cleaned up PDF: {pdf_path} for user: {user_id}")
    return jsonify({'success': True}), 200

# Profile Management
@app.route('/api/update-profile', methods=['PUT', 'OPTIONS'])
@jwt_required()
def update_profile():
    if request.method == 'OPTIONS':
        return '', 204
    user_id = get_jwt_identity()
    data = request.get_json()
    name, email, password = data.get('name'), data.get('email'), data.get('password')
    if not name or not email:
        return jsonify({'error': 'Name and email required'}), 400
    update_data = {"name": name, "email": email}
    if password:
        update_data["password"] = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    result = users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
    if result.matched_count == 0:
        return jsonify({'error': 'User not found'}), 404
    logging.info(f"Profile updated for user: {user_id}")
    return jsonify({'message': 'Profile updated successfully'}), 200

# MCQ Generation Endpoints
@app.route('/api/upload-pdf', methods=['POST'])
@jwt_required()
def upload_pdf():
    user_id = get_jwt_identity()
    if 'pdf' not in request.files:
        return jsonify({'error': 'No PDF file provided'}), 400
    pdf_file = request.files['pdf']
    pdf_name = pdf_file.filename
    if not pdf_name.endswith('.pdf'):
        return jsonify({'error': 'Invalid file format'}), 400
    temp_path = f"temp_{user_id}_{pdf_name}"
    pdf_file.save(temp_path)
    logging.info(f"PDF uploaded: {temp_path}")
    return jsonify({'success': True, 'pdf_path': temp_path, 'pdf_name': pdf_name}), 200

@app.route('/api/generate-mcqs', methods=['POST'])
@jwt_required()
def generate_mcqs_endpoint():
    user_id = get_jwt_identity()
    logging.info(f"Request to /api/generate-mcqs by user: {user_id}")
    pdf_path = None
    try:
        pdf_path = request.form.get('pdf_path')
        num_questions = request.form.get('num_questions', default=5, type=int)
        difficulty = request.form.get('difficulty', default='medium', type=str).lower()
        test_name = request.form.get('test_name', f"Test_{datetime.now(IST).strftime('%Y%m%d_%H%M%S')}")
        pdf_name = request.form.get('pdf_name')

        if not pdf_path or not os.path.exists(pdf_path):
            return jsonify({'error': 'PDF path invalid or missing'}), 400
        if not pdf_name:
            return jsonify({'error': 'PDF name missing'}), 400
        if num_questions < 1 or num_questions > 20:
            return jsonify({'error': 'Number of questions must be 1-20'}), 400
        if difficulty not in ['easy', 'medium', 'hard']:
            return jsonify({'error': 'Difficulty must be easy, medium, or hard'}), 400

        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY not set")

        extracted_text = extract_text_from_pdf(pdf_path)
        mcqs = generate_mcqs_from_random_chunks(extracted_text, groq_api_key, num_questions, difficulty)

        if isinstance(mcqs, dict) and 'error' in mcqs:
            logging.error(f"MCQ generation error: {mcqs['error']}")
            return jsonify({'success': False, 'error': mcqs['error']}), 500

        if len(mcqs) < num_questions:
            logging.warning(f"Generated only {len(mcqs)} MCQs instead of {num_questions} due to relevance filtering.")

        user = users_collection.find_one({"_id": ObjectId(user_id)})
        is_student = user.get('role') == 'student'

        existing_test = tests_collection.find_one({
            "user_id": user_id,
            "test_name": test_name,
            "status": "generated"
        })

        # For students, set duration but no start_time/end_time
        duration = 30 if is_student else None

        test_data = {
            "user_id": user_id,
            "test_name": test_name,
            "pdf_name": pdf_name,
            "mcqs": mcqs,
            "created_at": datetime.utcnow().isoformat(),
            "status": "active" if is_student else "generated",
            "assigned_to": [user_id] if is_student else [],
            "start_time": datetime.utcnow().isoformat() if is_student else None,
            "end_time": None,
            "duration": duration,
            "result": {}
        }

        if existing_test:
            tests_collection.update_one(
                {"_id": existing_test["_id"]},
                {"$set": {
                    "mcqs": mcqs,
                    "created_at": datetime.utcnow().isoformat(),
                }}
            )
            logging.info(f"Updated existing test {test_name} with {len(mcqs)} MCQs")
        else:
            tests_collection.insert_one(test_data)
            logging.info(f"Created new test {test_name} with {len(mcqs)} MCQs")

        return jsonify({
            'success': True,
            'mcqs': mcqs,
            'test_name': test_name,
            'pdf_name': pdf_name,
            'warning': f"Only {len(mcqs)} questions generated due to relevance filtering" if len(mcqs) < num_questions else None
        }), 200
    except Exception as e:
        if pdf_path and os.path.exists(pdf_path):
            os.remove(pdf_path)
        logging.error(f"Error in /api/generate-mcqs: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/delete-test', methods=['DELETE'])
@jwt_required()
def delete_test():
    user_id = get_jwt_identity()
    try:
        data = request.get_json()
        test_name = data.get('test_name')
        if not test_name:
            return jsonify({'error': 'Test name required'}), 400

        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if user.get('role') != 'teacher':
            return jsonify({'error': 'Only teachers can delete tests'}), 403

        test = tests_collection.find_one({"user_id": user_id, "test_name": test_name, "status": "generated"})
        if not test:
            return jsonify({'error': 'Test not found or not in generated state'}), 404

        result = tests_collection.delete_one({"user_id": user_id, "test_name": test_name})
        if result.deleted_count == 0:
            return jsonify({'error': 'Failed to delete test'}), 500

        logging.info(f"Test {test_name} deleted by user {user_id}")
        return jsonify({'success': True, 'message': 'Test deleted successfully'}), 200
    except Exception as e:
        logging.error(f"Error in /api/delete-test: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# Review and Edit MCQs
@app.route('/api/review-mcqs', methods=['GET'])
@jwt_required()
def review_mcqs():
    user_id = get_jwt_identity()
    test_name = request.args.get('test_name')
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=10, type=int)
    if not test_name:
        return jsonify({'error': 'Test name required'}), 400

    test = tests_collection.find_one({"user_id": user_id, "test_name": test_name})
    if not test:
        return jsonify({'error': 'Test not found'}), 404

    mcqs = test['mcqs']
    total = len(mcqs)
    start = (page - 1) * limit
    end = start + limit
    paginated_mcqs = mcqs[start:end]

    logging.info(f"Retrieved {len(paginated_mcqs)} MCQs for test {test_name}, page {page}")
    return jsonify({
        'test_name': test_name,
        'pdf_name': test['pdf_name'],
        'mcqs': paginated_mcqs,
        'total': total,
        'page': page,
        'pages': (total + limit - 1) // limit
    }), 200

@app.route('/api/update-mcq', methods=['PUT'])
@jwt_required()
def update_mcq():
    user_id = get_jwt_identity()
    data = request.get_json()
    test_name, mcq_index, updated_mcq = data.get('test_name'), data.get('mcq_index'), data.get('updated_mcq')
    if not test_name or mcq_index is None or not updated_mcq:
        return jsonify({'error': 'Missing required fields'}), 400

    test = tests_collection.find_one({"user_id": user_id, "test_name": test_name})
    if not test or mcq_index >= len(test['mcqs']):
        return jsonify({'error': 'Test or MCQ not found'}), 404

    required_fields = {"question", "options", "correct_answer", "type", "difficulty", "relevance_score"}
    if not all(field in updated_mcq for field in required_fields) or len(updated_mcq["options"]) != 4:
        return jsonify({'error': 'Invalid MCQ format'}), 400

    tests_collection.update_one(
        {"user_id": user_id, "test_name": test_name},
        {"$set": {f"mcqs.{mcq_index}": updated_mcq}}
    )
    logging.info(f"Updated MCQ at index {mcq_index} for test {test_name}")
    return jsonify({'message': 'MCQ updated successfully'}), 200

@app.route('/api/delete-mcq', methods=['DELETE'])
@jwt_required()
def delete_mcq():
    user_id = get_jwt_identity()
    test_name = request.args.get('test_name')
    mcq_index = request.args.get('mcq_index', type=int)
    if not test_name or mcq_index is None:
        return jsonify({'error': 'Test name and MCQ index required'}), 400

    test = tests_collection.find_one({"user_id": user_id, "test_name": test_name})
    if not test or mcq_index >= len(test['mcqs']):
        return jsonify({'error': 'Test or MCQ not found'}), 404

    tests_collection.update_one(
        {"user_id": user_id, "test_name": test_name},
        {"$pull": {"mcqs": test['mcqs'][mcq_index]}}
    )
    logging.info(f"Deleted MCQ at index {mcq_index} from test {test_name}")
    return jsonify({'message': 'MCQ deleted successfully'}), 200

@app.route('/api/regenerate-mcq', methods=['POST'])
@jwt_required()
def regenerate_mcq():
    user_id = get_jwt_identity()
    data = request.get_json()
    test_name, mcq_index = data.get('test_name'), data.get('mcq_index')
    if not test_name or mcq_index is None:
        return jsonify({'error': 'Test name and MCQ index required'}), 400

    test = tests_collection.find_one({"user_id": user_id, "test_name": test_name})
    if not test or mcq_index >= len(test['mcqs']):
        return jsonify({'error': 'Test or MCQ not found'}), 404

    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        return jsonify({'error': 'GROQ_API_KEY not set'}), 500

    extracted_text = extract_text_from_pdf(f"temp_{user_id}_{test['pdf_name']}")
    new_mcq = generate_mcq_with_relevance(extracted_text, groq_api_key, num_questions=1, difficulty=test['mcqs'][mcq_index]['difficulty'])
    if isinstance(new_mcq, dict) and 'error' in new_mcq:
        return jsonify({'error': new_mcq['error']}), 500

    tests_collection.update_one(
        {"user_id": user_id, "test_name": test_name},
        {"$set": {f"mcqs.{mcq_index}": new_mcq[0]}}
    )
    logging.info(f"Regenerated MCQ at index {mcq_index} for test {test_name}")
    return jsonify({'message': 'MCQ regenerated successfully', 'new_mcq': new_mcq[0]}), 200

# Test Management
@app.route('/api/assign-test', methods=['POST'])
@jwt_required()
def assign_test():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user['role'] != 'teacher':
        return jsonify({'error': 'Only teachers can assign tests'}), 403

    data = request.get_json()
    test_name, student_ids, start_time, end_time, duration = (
        data.get('test_name'), data.get('student_ids', []), data.get('start_time'),
        data.get('end_time'), data.get('duration')
    )
    if not all([test_name, student_ids, start_time, end_time, duration]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Validate IST times
    try:
        start_dt = IST.localize(datetime.fromisoformat(start_time))
        end_dt = IST.localize(datetime.fromisoformat(end_time))
        if start_dt >= end_dt:
            return jsonify({'error': 'Start time must be before end time'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid IST date/time format (e.g., 2025-04-15T10:00:00)'}), 400

    test = tests_collection.find_one({"user_id": user_id, "test_name": test_name})
    if not test:
        return jsonify({'error': 'Test not found'}), 404

    try:
        valid_student_ids = [ObjectId(sid) for sid in student_ids]
    except InvalidId:
        return jsonify({'error': 'Invalid student ID format'}), 400

    valid_students = users_collection.find({"_id": {"$in": valid_student_ids}, "role": "student"})
    valid_student_ids_str = [str(student['_id']) for student in valid_students]
    if len(valid_student_ids_str) != len(student_ids):
        return jsonify({'error': 'Some student IDs are invalid'}), 400

    tests_collection.update_one(
        {"user_id": user_id, "test_name": test_name},
        {"$set": {
            "assigned_to": valid_student_ids_str,
            "start_time": start_dt.isoformat(),  # Store in IST
            "end_time": end_dt.isoformat(),      # Store in IST
            "duration": duration,
            "status": "assigned"
        }}
    )
    logging.info(f"Test {test_name} assigned to {len(valid_student_ids_str)} students")
    return jsonify({'success': True, 'message': f'Test {test_name} assigned successfully'}), 200

@app.route('/api/manage-test', methods=['POST'])
@jwt_required()
def manage_test():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user['role'] != 'teacher':
        return jsonify({'error': 'Only teachers can manage tests'}), 403

    data = request.get_json()
    test_name, action = data.get('test_name'), data.get('action')
    if not all([test_name, action]):
        return jsonify({'error': 'Missing required fields'}), 400

    test = tests_collection.find_one({"user_id": user_id, "test_name": test_name})
    if not test:
        return jsonify({'error': 'Test not found'}), 404

    if action == "start":
        tests_collection.update_one({"user_id": user_id, "test_name": test_name}, {"$set": {"status": "active"}})
        logging.info(f"Test {test_name} started")
        return jsonify({'message': 'Test started'}), 200
    elif action == "stop":
        tests_collection.update_one({"user_id": user_id, "test_name": test_name}, {"$set": {"status": "stopped"}})
        logging.info(f"Test {test_name} stopped")
        return jsonify({'message': 'Test stopped'}), 200
    elif action == "reassign":
        student_ids, start_time, end_time = data.get('student_ids', []), data.get('start_time'), data.get('end_time')
        if not all([student_ids, start_time, end_time]):
            return jsonify({'error': 'Missing fields for reassign'}), 400
        try:
            start_dt = IST.localize(datetime.fromisoformat(start_time))
            end_dt = IST.localize(datetime.fromisoformat(end_time))
            if start_dt >= end_dt:
                return jsonify({'error': 'Start time must be before end time'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid IST date/time format (e.g., 2025-04-15T10:00:00)'}), 400
        try:
            valid_student_ids = [ObjectId(sid) for sid in student_ids]
        except InvalidId:
            return jsonify({'error': 'Invalid student ID format'}), 400
        valid_students = users_collection.find({"_id": {"$in": valid_student_ids}, "role": "student"})
        valid_student_ids_str = [str(student['_id']) for student in valid_students]
        if len(valid_student_ids_str) != len(student_ids):
            return jsonify({'error': 'Some student IDs are invalid'}), 400
        tests_collection.update_one(
            {"user_id": user_id, "test_name": test_name},
            {"$set": {
                "assigned_to": valid_student_ids_str,
                "start_time": start_dt.isoformat(),  # Use IST
                "end_time": end_dt.isoformat(),      # Use IST
                "status": "assigned"
            }}
        )
        logging.info(f"Test {test_name} reassigned")
        return jsonify({'message': 'Test reassigned'}), 200
    return jsonify({'error': 'Invalid action'}), 400

# Test Submission and Results
@app.route('/api/save-test-result', methods=['POST'])
@jwt_required()
def save_test_result():
    user_id = get_jwt_identity()
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user or 'role' not in user or user['role'] != 'student':
            return jsonify({'error': 'Only students can submit results'}), 403

        try:
            data = request.get_json()
        except Exception as e:
            logging.error(f"Invalid JSON payload: {str(e)}")
            return jsonify({"error": "Invalid JSON payload"}), 400

        logging.info(f"Request to /api/save-test-result by user: {user_id}, data: {data}")
        test_name = data.get('test_name')
        result = data.get('result')

        if not all([test_name, result]):
            return jsonify({"message": "Missing test_name or result"}), 400

        test = tests_collection.find_one({"test_name": test_name, "assigned_to": user_id})
        if not test:
            return jsonify({"message": "Test not found or not assigned"}), 404

        now = datetime.utcnow().isoformat()
        if test['status'] != "active" or now < test['start_time'] or (test.get('end_time') and now > test['end_time']):
            return jsonify({"message": "Test not active or time expired"}), 403

        tests_collection.update_one({"test_name": test_name}, {"$set": {f"result.{user_id}": result}})
        logging.info(f"Response: Result saved for test {test_name}")
        return jsonify({"message": "Test result saved"}), 200
    except Exception as e:
        logging.error(f"Error in /api/save-test-result: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/user-tests', methods=['GET'])
@jwt_required()
def get_user_tests():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    query = {"user_id": user_id} if user['role'] == 'teacher' else {"assigned_to": user_id}
    pdf_name, test_name = request.args.get('pdf_name'), request.args.get('test_name')
    if pdf_name:
        query["pdf_name"] = pdf_name
    if test_name:
        query["test_name"] = test_name

    tests = list(tests_collection.find(query))
    for test in tests:
        # Only update status for teacher-assigned tests
        if test.get('user_id') != user_id:  # Not student-generated
            now = datetime.now(IST).isoformat()
            start_time = test.get("start_time")
            end_time = test.get("end_time")
            if start_time and end_time:
                if now >= start_time and now <= end_time and test["status"] != "active":
                    tests_collection.update_one(
                        {"_id": test["_id"]},
                        {"$set": {"status": "active"}}
                    )
                    test["status"] = "active"
                elif now > end_time and test["status"] not in ["stopped", "completed"]:
                    tests_collection.update_one(
                        {"_id": test["_id"]},
                        {"$set": {"status": "stopped"}}
                    )
                    test["status"] = "stopped"
        test["_id"] = str(test["_id"])
    logging.info(f"Retrieved {len(tests)} tests for user {user_id}")
    return jsonify(tests), 200

@app.route('/api/student-results', methods=['GET'])
@jwt_required()
def get_student_results():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user['role'] != 'teacher':
        return jsonify({'error': 'Only teachers can view results'}), 403

    test_name = request.args.get('test_name')
    if not test_name:
        return jsonify({'error': 'Test name required'}), 400

    test = tests_collection.find_one({"user_id": user_id, "test_name": test_name})
    if not test:
        return jsonify({'error': 'Test not found'}), 404

    logging.info(f"Retrieved results for test {test_name}")
    return jsonify({'test_name': test_name, 'results': test.get('result', {})}), 200

@app.route('/api/export-results', methods=['GET'])
@jwt_required()
def export_results():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user['role'] != 'teacher':
        return jsonify({'error': 'Only teachers can export results'}), 403

    test_name = request.args.get('test_name')
    if not test_name:
        return jsonify({'error': 'Test name required'}), 400

    test = tests_collection.find_one({"user_id": user_id, "test_name": test_name})
    if not test:
        return jsonify({'error': 'Test not found'}), 404

    results = test.get('result', {})
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Student ID', 'Score', 'Total Questions', 'Time Spent'])
    for student_id, result in results.items():
        writer.writerow([student_id, result['score'], result['totalQuestions'], result['timeSpent']])

    output.seek(0)
    logging.info(f"Exported results for test {test_name} as CSV")
    return send_file(
        io.BytesIO(output.getvalue().encode('utf-8')),
        mimetype='text/csv',
        as_attachment=True,
        download_name=f"{test_name}_results.csv"
    )

# Student Management
@app.route('/api/students', methods=['GET'])
@jwt_required()
def get_students():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user['role'] != 'teacher':
        return jsonify({'error': 'Only teachers can view students'}), 403

    students = list(users_collection.find({"role": "student"}, {"_id": 1, "name": 1, "email": 1}))
    response = [{**student, "_id": str(student["_id"])} for student in students]
    logging.info(f"Retrieved {len(response)} students")
    return jsonify(response), 200

@app.route('/api/students/update', methods=['PUT'])
@jwt_required()
def update_student():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user['role'] != 'teacher':
        return jsonify({'error': 'Only teachers can update students'}), 403

    data = request.get_json()
    student_id, name, email, password = data.get('student_id'), data.get('name'), data.get('email'), data.get('password')
    if not all([student_id, name, email]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        student_obj_id = ObjectId(student_id)
    except InvalidId:
        return jsonify({'error': 'Invalid student ID format'}), 400

    update_data = {"name": name, "email": email}
    if password:
        update_data["password"] = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    result = users_collection.update_one({"_id": student_obj_id, "role": "student"}, {"$set": update_data})
    if result.matched_count == 0:
        return jsonify({'error': 'Student not found'}), 404

    logging.info(f"Student {student_id} updated by teacher {user_id}")
    return jsonify({'message': 'Student updated successfully'}), 200

@app.route('/api/students/delete', methods=['DELETE'])
@jwt_required()
def delete_student():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user['role'] != 'teacher':
        return jsonify({'error': 'Only teachers can delete students'}), 403

    student_id = request.args.get('student_id')
    if not student_id:
        return jsonify({'error': 'Student ID required'}), 400

    try:
        student_obj_id = ObjectId(student_id)
    except InvalidId:
        return jsonify({'error': 'Invalid student ID format'}), 400

    result = users_collection.delete_one({"_id": student_obj_id, "role": "student"})
    if result.deleted_count == 0:
        return jsonify({'error': 'Student not found'}), 404

    tests_collection.update_many({"assigned_to": student_id}, {"$pull": {"assigned_to": student_id}})
    logging.info(f"Student {student_id} deleted by teacher {user_id}")
    return jsonify({'message': 'Student deleted successfully'}), 200

if __name__ == '__main__':
    logging.info("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5001)
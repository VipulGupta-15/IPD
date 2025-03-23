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

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f"backend_{datetime.now().strftime('%Y%m%d')}.log"),
        logging.StreamHandler()  # Also log to console
    ]
)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Adjust origin in production

# MongoDB setup
MONGO_DB_URI = os.getenv("MONGO_DB_URI")
client = MongoClient(MONGO_DB_URI)
db = client['mcq_generator']  # Database name
users_collection = db['users']
tests_collection = db['tests']  # New collection for tests and results

# JWT setup
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET", "your_jwt_secret_key_here")  # Set in .env
jwt = JWTManager(app)

def extract_text_from_pdf(pdf_path, max_chars=4000):
    """Extract text from a PDF file and limit its length."""
    try:
        logging.info(f"Extracting text from PDF: {pdf_path}")
        text = ""
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text("text") + "\n"
                if len(text) > max_chars:
                    break
        extracted_text = text[:max_chars]
        logging.info(f"Extracted {len(extracted_text)} characters from PDF")
        return extracted_text
    except Exception as e:
        logging.error(f"Failed to extract text from PDF: {str(e)}")
        raise Exception(f"PDF extraction error: {str(e)}")

def extract_json_from_response(raw_output):
    """Extract JSON content from a response that may include text or markdown."""
    try:
        raw_output = raw_output.strip()
        logging.debug(f"Attempting to extract JSON from response: {raw_output[:100]}...")

        start_idx = raw_output.find('[')
        end_idx = raw_output.rfind(']') + 1

        if start_idx == -1 or end_idx == 0:
            raise ValueError("No JSON array delimiters ([ and ]) found in response")

        json_str = raw_output[start_idx:end_idx].strip()
        logging.debug(f"Extracted JSON string: {json_str[:100]}...")

        mcq_output = json.loads(json_str)
        logging.info("Successfully extracted and parsed JSON from response")
        return mcq_output
    except json.JSONDecodeError as e:
        logging.error(f"JSON parsing failed: {str(e)}")
        raise ValueError(f"Failed to parse extracted JSON: {str(e)}")
    except ValueError as e:
        logging.error(f"Invalid response format: {str(e)}")
        raise
    except Exception as e:
        logging.error(f"Unexpected error during JSON extraction: {str(e)}")
        raise

def generate_mcq(text, groq_api_key, num_questions=5, difficulty="medium"):
    """Generate MCQs using Groq Cloud API with specified parameters."""
    try:
        logging.info(f"Generating {num_questions} MCQs with difficulty '{difficulty}'")
        client = Groq(api_key=groq_api_key)

        prompt = (
            f"You are an AI that generates multiple-choice questions (MCQs) from text. "
            f"Generate {num_questions} multiple-choice questions from the following text. "
            f"Difficulty level: {difficulty} (easy: basic concepts, medium: moderate understanding, hard: complex analysis). "
            f"Include a mix of theoretical and numerical questions where applicable. "
            f"Format each question as a JSON object with: "
            f"question (string), options (array of 4 strings), correct_answer (string), type (theory/numerical), difficulty (string). "
            f"Return the output as a JSON array with no additional text or markdown, just the raw JSON.\n\nText:\n{text}"
        )

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an AI expert in question generation."},
                {"role": "user", "content": prompt}
            ],
            temperature=1,
            max_completion_tokens=2048,
            top_p=1,
            stream=False,
            stop=None,
        )

        raw_output = completion.choices[0].message.content
        logging.debug(f"Raw Groq response: {raw_output}")

        mcq_output = extract_json_from_response(raw_output)
        if not isinstance(mcq_output, list):
            logging.error("Parsed response is not a JSON array")
            return {"error": "Response is not a JSON array", "raw_output": raw_output}

        required_fields = {"question", "options", "correct_answer", "type", "difficulty"}
        for mcq in mcq_output:
            if not all(field in mcq for field in required_fields):
                logging.error(f"Invalid MCQ format: {mcq}")
                return {"error": "Invalid MCQ format", "raw_output": raw_output}
            if not isinstance(mcq["options"], list) or len(mcq["options"]) != 4:
                logging.error(f"MCQ options must be a list of 4 items: {mcq}")
                return {"error": "MCQ options must be a list of 4 items", "raw_output": raw_output}

        logging.info(f"Generated {len(mcq_output)} MCQs successfully")
        return mcq_output
    except Exception as e:
        logging.error(f"MCQ generation failed: {str(e)}")
        return {"error": str(e), "raw_output": raw_output if 'raw_output' in locals() else ""}

@app.route('/api/generate-mcqs', methods=['POST'])
@jwt_required()
def generate_mcqs_endpoint():
    """Endpoint to generate MCQs from an uploaded PDF and store them in MongoDB."""
    try:
        user_id = get_jwt_identity()
        logging.info(f"Received request to /api/generate-mcqs from user: {user_id}")

        if 'pdf' not in request.files:
            logging.warning("No PDF file provided in request")
            return jsonify({'error': 'No PDF file provided'}), 400

        pdf_file = request.files['pdf']
        num_questions = request.form.get('num_questions', default=5, type=int)
        difficulty = request.form.get('difficulty', default='medium', type=str).lower()
        test_name = request.form.get('test_name', f"Test_{datetime.now().strftime('%Y%m%d_%H%M%S')}")

        if pdf_file.filename == '':
            logging.warning("No file selected")
            return jsonify({'error': 'No file selected'}), 400

        if not pdf_file.filename.endswith('.pdf'):
            logging.warning(f"Invalid file format: {pdf_file.filename}")
            return jsonify({'error': 'Invalid file format. Please upload a PDF'}), 400

        if num_questions < 1 or num_questions > 20:
            logging.warning(f"Invalid num_questions: {num_questions}")
            return jsonify({'error': 'Number of questions must be between 1 and 20'}), 400

        valid_difficulties = ['easy', 'medium', 'hard']
        if difficulty not in valid_difficulties:
            logging.warning(f"Invalid difficulty: {difficulty}")
            return jsonify({'error': f'Difficulty must be one of: {", ".join(valid_difficulties)}'}), 400

        temp_path = 'temp_upload.pdf'
        pdf_file.save(temp_path)
        logging.info(f"Saved PDF to {temp_path}")

        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            logging.error("GROQ_API_KEY not set in environment")
            raise Exception("GROQ_API_KEY environment variable is not set")

        extracted_text = extract_text_from_pdf(temp_path)
        mcqs = generate_mcq(extracted_text, groq_api_key, num_questions, difficulty)

        if os.path.exists(temp_path):
            os.remove(temp_path)
            logging.info(f"Cleaned up temporary file: {temp_path}")

        if isinstance(mcqs, dict) and 'error' in mcqs:
            logging.error(f"MCQ generation returned an error: {mcqs['error']}")
            return jsonify({
                'success': False,
                'error': mcqs['error'],
                'raw_output': mcqs.get('raw_output', '')
            }), 500

        # Store MCQs in MongoDB
        test_data = {
            "user_id": user_id,
            "test_name": test_name,
            "mcqs": mcqs,
            "created_at": datetime.utcnow().isoformat(),
            "status": "generated",  # Can be "generated", "completed"
            "result": None  # Will be updated when test is completed
        }
        tests_collection.insert_one(test_data)
        logging.info(f"Stored MCQs for test '{test_name}' in MongoDB for user {user_id}")

        return jsonify({
            'success': True,
            'mcqs': mcqs,
            'test_name': test_name,
            'extracted_text': extracted_text
        }), 200

    except Exception as e:
        logging.error(f"Internal server error: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/save-test-result', methods=['POST'])
@jwt_required()
def save_test_result():
    """Save test result to MongoDB."""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        test_name = data.get('test_name')
        result = data.get('result')

        if not test_name or not result:
            logging.warning("Missing test_name or result in request")
            return jsonify({"message": "Missing test_name or result"}), 400

        # Update the test document in MongoDB
        tests_collection.update_one(
            {"user_id": user_id, "test_name": test_name},
            {"$set": {"result": result, "status": "completed", "completed_at": datetime.utcnow().isoformat()}}
        )
        logging.info(f"Saved test result for '{test_name}' for user {user_id}")
        return jsonify({"message": "Test result saved successfully"}), 200

    except Exception as e:
        logging.error(f"Error saving test result: {str(e)}", exc_info=True)
        return jsonify({"message": "Server error"}), 500

@app.route('/api/user-tests', methods=['GET'])
@jwt_required()
def get_user_tests():
    """Fetch all tests for the logged-in user."""
    try:
        user_id = get_jwt_identity()
        tests = list(tests_collection.find({"user_id": user_id}, {"_id": 0}))  # Exclude _id field
        logging.info(f"Fetched {len(tests)} tests for user {user_id}")
        return jsonify(tests), 200

    except Exception as e:
        logging.error(f"Error fetching user tests: {str(e)}", exc_info=True)
        return jsonify({"message": "Server error"}), 500

# Signup endpoint
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')

        if not all([name, email, password, role]) or role not in ['teacher', 'student']:
            logging.warning("Missing or invalid fields in signup request")
            return jsonify({"message": "Missing or invalid fields"}), 400

        if users_collection.find_one({"email": email, "role": role}):
            logging.warning(f"User already exists: {email}, {role}")
            return jsonify({"message": "User already exists with this email and role"}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "role": role
        }
        result = users_collection.insert_one(user)
        
        access_token = create_access_token(identity=str(result.inserted_id))
        logging.info(f"User signed up successfully: {email}, {role}")
        return jsonify({
            "message": "Account created successfully",
            "token": access_token,
            "role": role
        }), 201

    except Exception as e:
        logging.error(f"Signup error: {str(e)}", exc_info=True)
        return jsonify({"message": "Server error"}), 500

# Login endpoint
@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')

        if not all([email, password, role]) or role not in ['teacher', 'student']:
            logging.warning("Missing or invalid fields in login request")
            return jsonify({"message": "Missing or invalid fields"}), 400

        user = users_collection.find_one({"email": email, "role": role})
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
            access_token = create_access_token(identity=str(user['_id']))
            logging.info(f"User logged in successfully: {email}, {role}")
            return jsonify({
                "message": "Logged in successfully",
                "token": access_token,
                "role": user['role']
            }), 200
        else:
            logging.warning(f"Login failed for {email}, {role}")
            return jsonify({"message": "Invalid email, password, or role"}), 401

    except Exception as e:
        logging.error(f"Login error: {str(e)}", exc_info=True)
        return jsonify({"message": "Server error"}), 500

if __name__ == '__main__':
    logging.info("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5001)
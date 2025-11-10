from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.models import create_user
import bcrypt

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    db = current_app.mongo
    
    # Check if user exists
    if db.users.find_one({'username': data['username']}):
        return jsonify({'error': 'Username already exists'}), 400
        
    if db.users.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already exists'}), 400
    
    # Hash password
    password_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    # Create new user
    new_user = create_user(
        username=data['username'],
        email=data['email'],
        password_hash=password_hash,
        role=data.get('role', 'pilot')
    )
    
    # Insert into database
    result = db.users.insert_one(new_user)
    
    return jsonify({'message': 'User created successfully', 'id': str(result.inserted_id)}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(f"Login request received: {data}")
    db = current_app.mongo
    
    user_data = db.users.find_one({'username': data['username']})
    print(f"User data from DB: {user_data}")
    
    if user_data and bcrypt.checkpw(data['password'].encode('utf-8'), user_data['password_hash']):
        access_token = create_access_token(identity=str(user_data['_id']))
        print("Login successful")
        return jsonify({
            'token': access_token,
            'user': {
                'username': user_data['username'],
                'role': user_data['role']
            }
        }), 200
        
    print("Invalid credentials")
    return jsonify({'error': 'Invalid credentials'}), 401
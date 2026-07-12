from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.models import create_user
import bcrypt
import re

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

import random

def generate_mode_s():
    return f"C0A{random.randint(0, 4095):03X}"

@bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No input data provided'}), 400
            
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Missing or empty required field: {field}'}), 400
        
        if not is_valid_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
            
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
            
        role = data.get('role', 'pilot')
        mode_s_address = None
        facility_designator = None
        
        if role == 'pilot':
            mode_s_address = data.get('mode_s_address', '').strip().upper()
            if not mode_s_address:
                mode_s_address = generate_mode_s()
            elif not re.match(r"^[A-F0-9]{6}$", mode_s_address):
                return jsonify({'error': 'Mode S address must be a 6-digit hex code'}), 400
        elif role == 'controller':
            facility_designator = data.get('facility_designator', '').strip().upper()
            if not facility_designator:
                return jsonify({'error': 'Facility designator is required for controllers'}), 400
            if not re.match(r"^[A-Z]{4}$", facility_designator):
                return jsonify({'error': 'Facility designator must be a 4-letter ICAO location indicator'}), 400
        
        db = current_app.mongo
        
        # Check if user exists
        if db.users.find_one({'username': data['username']}):
            return jsonify({'error': 'Username already exists'}), 400
            
        if db.users.find_one({'email': data['email']}):
            return jsonify({'error': 'Email already exists'}), 400
            
        if role == 'pilot' and db.users.find_one({'mode_s_address': mode_s_address}):
            return jsonify({'error': 'Mode S Address already registered'}), 400
            
        if role == 'controller' and db.users.find_one({'facility_designator': facility_designator}):
            return jsonify({'error': 'Facility Designator already registered'}), 400
        
        # Hash password
        password_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Create new user
        new_user = create_user(
            username=data['username'],
            email=data['email'],
            password_hash=password_hash,
            role=role,
            mode_s_address=mode_s_address,
            facility_designator=facility_designator
        )
        
        # Insert into database
        result = db.users.insert_one(new_user)
        
        current_app.logger.info(f"User registered: {data['username']} with role {role}")
        return jsonify({
            'message': 'User created successfully',
            'id': str(result.inserted_id),
            'mode_s_address': mode_s_address,
            'facility_designator': facility_designator
        }), 201
    except Exception as e:
        current_app.logger.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'An internal server error occurred'}), 500

@bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({'error': 'Username and password are required'}), 400
            
        db = current_app.mongo
        user_data = db.users.find_one({'username': data['username']})
        
        if user_data and bcrypt.checkpw(data['password'].encode('utf-8'), user_data['password_hash']):
            access_token = create_access_token(identity=str(user_data['_id']))
            current_app.logger.info(f"Successful login for user: {data['username']}")
            return jsonify({
                'token': access_token,
                'user': {
                    'username': user_data['username'],
                    'role': user_data['role'],
                    'mode_s_address': user_data.get('mode_s_address'),
                    'facility_designator': user_data.get('facility_designator')
                }
            }), 200
            
        current_app.logger.warning(f"Failed login attempt for username: {data.get('username')}")
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'An internal server error occurred during login'}), 500
from flask import jsonify, request
from models import User
from werkzeug.security import check_password_hash
import jwt
from flask_app_config import app
from database import db

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if check_password_hash(user.password_hash, password):
        token = jwt.encode({'user_id': user.id}, app.config['SECRET_KEY'])
        return jsonify({'token': token.decode('utf-8'), 'role': user.role}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

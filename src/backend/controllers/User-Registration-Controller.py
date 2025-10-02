from flask import jsonify, make_response, request
from models import User
from database import db # type: ignore
from password_hashing import hash_password
from flask_app_config import app

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not username or not password or not role:
        return jsonify({'error': 'Missing required fields'}), 400

    user_exists = User.query.filter_by(username=username).first()
    if user_exists:
        return jsonify({'error': 'Username already exists'}), 409

    new_user = User(
        username=username,
        password_hash=hash_password(password),
        role=role,
        status='active'
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': f'User {username} registered successfully'}), 201

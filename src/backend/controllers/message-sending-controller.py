from flask import jsonify, request
from flask_app_config import app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from models import Message
from database import db

@app.route('/messages', methods=['POST'])
@jwt_required()
def send_message():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    sender_id = get_jwt_identity()
    receiver_id = data.get('receiver_id')
    message_text = data.get('message_text')

    if not receiver_id or not message_text:
        return jsonify({'error': 'Missing required fields'}), 400

    new_message = Message(
        sender_id=sender_id,
        receiver_id=receiver_id,
        message_text=message_text,
        timestamp=datetime.utcnow(),
        status='sent'
    )

    db.session.add(new_message)
    db.session.commit()

    return jsonify({'message': 'Message sent successfully', 'message_id': new_message.id}), 201

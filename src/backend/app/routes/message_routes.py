from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

bp = Blueprint('messages', __name__, url_prefix='/api/messages')

@bp.route('', methods=['POST'])
@bp.route('/send', methods=['POST'])
@jwt_required()
def send_message():
    data = request.get_json()
    sender_id = get_jwt_identity()
    db = current_app.mongo
    
    # Create new message
    new_message = {
        'sender_id': sender_id,
        'recipient': data['recipient'],
        'content': data['content'],
        'type': data.get('type', 'clearance'),
        'timestamp': datetime.utcnow()
    }
    
    # Insert into MongoDB
    result = db.messages.insert_one(new_message)
    
    if result.inserted_id:
        return jsonify({
            'message': 'Message sent successfully',
            'message_id': str(result.inserted_id)
        }), 201
    else:
        return jsonify({'error': 'Failed to send message'}), 500

@bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    db = current_app.mongo
    
    # Get all messages where user is sender or recipient
    messages = list(db.messages.find({
        '$or': [
            {'sender_id': user_id},
            {'recipient': user_id}
        ]
    }).sort('timestamp', -1))
    
    # Convert ObjectId to string for JSON serialization
    for msg in messages:
        msg['_id'] = str(msg['_id'])
    
    return jsonify(messages)
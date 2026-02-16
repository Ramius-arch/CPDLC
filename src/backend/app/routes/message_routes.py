from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

bp = Blueprint('messages', __name__, url_prefix='/api/messages')

@bp.route('', methods=['POST'])
@bp.route('/send', methods=['POST'])
@jwt_required()
def send_message():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No input data provided'}), 400
            
        required_fields = ['recipient', 'content']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Missing or empty required field: {field}'}), 400
                
        if len(data['content']) > 1000:
            return jsonify({'error': 'Message content too long (max 1000 characters)'}), 400
                
        sender_id = get_jwt_identity()
        db = current_app.mongo
        
        # Verify recipient existence
        recipient = db.users.find_one({'username': data['recipient']})
        if not recipient:
            return jsonify({'error': f"Recipient '{data['recipient']}' not found"}), 404
        
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
            current_app.logger.info(f"Message sent from {sender_id} to {data['recipient']}")
            return jsonify({
                'message': 'Message sent successfully',
                'message_id': str(result.inserted_id)
            }), 201
        else:
            return jsonify({'error': 'Failed to send message'}), 500
    except Exception as e:
        current_app.logger.error(f"Send message error: {str(e)}")
        return jsonify({'error': 'An internal server error occurred'}), 500

@bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    try:
        user_id = get_jwt_identity()
        db = current_app.mongo
        
        # Get all messages where user is sender or recipient
        messages = list(db.messages.find({
            '$or': [
                {'sender_id': user_id},
                {'recipient': user_id}
            ]
        }).sort('timestamp', -1).limit(100))
        
        # Convert ObjectId and datetime to serializable formats
        for msg in messages:
            msg['_id'] = str(msg['_id'])
            if 'timestamp' in msg and isinstance(msg['timestamp'], datetime):
                msg['timestamp'] = msg['timestamp'].isoformat()
        
        return jsonify(messages), 200
    except Exception as e:
        current_app.logger.error(f"Get history error: {str(e)}")
        return jsonify({'error': 'Could not fetch message history'}), 500
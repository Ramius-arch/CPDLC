from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from bson import ObjectId

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
        
        # Verify sender and recipient existence
        sender = db.users.find_one({'_id': ObjectId(sender_id)})
        if not sender:
            return jsonify({'error': 'Sender user not found'}), 404
            
        recipient = db.users.find_one({'username': data['recipient']})
        if not recipient:
            return jsonify({'error': f"Recipient '{data['recipient']}' not found"}), 404
            
        sender_username = sender['username']
        
        # Calculate sequence number rollover (0-63)
        last_msg = db.messages.find_one(
            {
                '$or': [
                    {'$and': [{'sender_id': ObjectId(sender_id)}, {'recipient': data['recipient']}]},
                    {'$and': [{'sender_id': recipient['_id']}, {'recipient': sender_username}]}
                ]
            },
            sort=[('timestamp', -1)]
        )
        
        next_seq_num = 0
        if last_msg:
            next_seq_num = (last_msg.get('seq_num', 0) + 1) % 64
            
        # Create new ICAO message
        new_message = {
            'sender_id': ObjectId(sender_id),
            'sender_username': sender_username,
            'recipient': data['recipient'],
            'content': data['content'],
            'msg_code': data.get('msg_code', 'UM169'),
            'seq_num': next_seq_num,
            'ref_seq_num': data.get('ref_seq_num'),
            'status': 'sent',
            'timestamp': datetime.utcnow()
        }
        
        result = db.messages.insert_one(new_message)
        
        if result.inserted_id:
            current_app.logger.info(f"CPDLC Message [{new_message['msg_code']}] sent from {sender_username} to {data['recipient']} (Seq: {next_seq_num})")
            return jsonify({
                'message': 'Message sent successfully',
                'message_id': str(result.inserted_id),
                'seq_num': next_seq_num
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
        
        user = db.users.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        username = user['username']
        
        # Get chronological message history for this user
        messages = list(db.messages.find({
            '$or': [
                {'sender_id': ObjectId(user_id)},
                {'recipient': username}
            ]
        }).sort('timestamp', 1).limit(100))
        
        # Convert ObjectId and datetime to serializable formats
        for msg in messages:
            msg['_id'] = str(msg['_id'])
            msg['sender_id'] = str(msg['sender_id'])
            if 'timestamp' in msg and isinstance(msg['timestamp'], datetime):
                msg['timestamp'] = msg['timestamp'].isoformat()
        
        return jsonify(messages), 200
    except Exception as e:
        current_app.logger.error(f"Get history error: {str(e)}")
        return jsonify({'error': 'Could not fetch message history'}), 500

@bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    try:
        db = current_app.mongo
        users = list(db.users.find({}, {
            'username': 1,
            'role': 1,
            'mode_s_address': 1,
            'facility_designator': 1,
            '_id': 0
        }))
        return jsonify(users), 200
    except Exception as e:
        current_app.logger.error(f"Get users list error: {str(e)}")
        return jsonify({'error': 'Could not fetch users list'}), 500
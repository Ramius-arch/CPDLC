from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from datetime import datetime

bp = Blueprint('messages', __name__, url_prefix='/api/messages')

@bp.route('', methods=['GET'])
@jwt_required()
def get_messages():
    try:
        # Get MongoDB collection from app context
        messages = bp.app.mongo.messages
        
        # Get all messages sorted by timestamp
        message_list = list(messages.find().sort('timestamp', -1))
        
        # Convert ObjectId to string for JSON serialization
        for message in message_list:
            message['_id'] = str(message['_id'])
            if 'user_id' in message:
                message['user_id'] = str(message['user_id'])
                
        return jsonify(message_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/send', methods=['POST'])
@jwt_required()
def send_message():
    try:
        data = request.get_json()
        content = data.get('content')
        message_type = data.get('message_type')
        
        if not content:
            return jsonify({'error': 'Message content is required'}), 400
            
        user_id = get_jwt_identity()
        
        # Get MongoDB collection from app context
        messages = bp.app.mongo.messages
        
        # Create new message
        message = {
            'content': content,
            'message_type': message_type,
            'user_id': ObjectId(user_id),
            'timestamp': datetime.utcnow()
        }
        
        result = messages.insert_one(message)
        message['_id'] = str(result.inserted_id)
        message['user_id'] = user_id
        
        return jsonify(message), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/new', methods=['GET'])
@jwt_required()
def get_new_messages():
    try:
        # Get last message timestamp from query params
        last_timestamp = request.args.get('since')
        if last_timestamp:
            last_timestamp = datetime.fromisoformat(last_timestamp.replace('Z', '+00:00'))
            
        # Get MongoDB collection from app context
        messages = bp.app.mongo.messages
        
        # Query for new messages
        query = {'timestamp': {'$gt': last_timestamp}} if last_timestamp else {}
        message_list = list(messages.find(query).sort('timestamp', -1))
        
        # Convert ObjectId to string for JSON serialization
        for message in message_list:
            message['_id'] = str(message['_id'])
            if 'user_id' in message:
                message['user_id'] = str(message['user_id'])
                
        return jsonify(message_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
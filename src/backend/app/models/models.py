from datetime import datetime
from bson import ObjectId

def create_user(username, email, password_hash, role='pilot'):
    return {
        'username': username,
        'email': email,
        'password_hash': password_hash,
        'role': role,
        'created_at': datetime.utcnow()
    }

def create_message(sender_id, receiver_id, content, message_type='clearance', status='sent'):
    return {
        'sender_id': ObjectId(sender_id),
        'receiver_id': ObjectId(receiver_id),
        'content': content,
        'message_type': message_type,
        'status': status,
        'created_at': datetime.utcnow()
    }
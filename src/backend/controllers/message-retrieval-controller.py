from flask import jsonify, request
from models import Message
from database import db

@app.route('/messages/<int:message_id>', methods=['GET'])
@jwt_required()
def get_message(message_id):
    message = Message.query.get_or_404(message_id)
    current_user_id = get_jwt_identity()

    if message.sender_id != current_user_id and message.receiver_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    return jsonify({
        'id': message.id,
        'sender_id': message.sender_id,
        'receiver_id': message.receiver_id,
        'message_text': message.message_text,
        'timestamp': message.timestamp.isoformat(),
        'status': message.status
    }), 200

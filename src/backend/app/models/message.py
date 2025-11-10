from datetime import datetime
from bson import ObjectId

class Message:
    def __init__(self, sender_id, receiver_id, content, message_type='clearance', status='sent'):
        self.sender_id = sender_id
        self.receiver_id = receiver_id
        self.content = content
        self.message_type = message_type
        self.status = status
        self.created_at = datetime.utcnow()
    
    @staticmethod
    def from_db_object(db_object):
        if not db_object:
            return None
        return Message(
            sender_id=db_object['sender_id'],
            receiver_id=db_object['receiver_id'],
            content=db_object['content'],
            message_type=db_object.get('message_type', 'clearance'),
            status=db_object.get('status', 'sent')
        )
    
    def to_dict(self):
        return {
            'sender_id': str(self.sender_id),
            'receiver_id': str(self.receiver_id),
            'content': self.content,
            'message_type': self.message_type,
            'status': self.status,
            'created_at': self.created_at
        }
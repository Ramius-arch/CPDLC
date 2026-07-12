from datetime import datetime
from bson import ObjectId

class Message:
    def __init__(self, sender_id, recipient, content, msg_code='UM169', seq_num=0, ref_seq_num=None, status='sent'):
        self.sender_id = sender_id
        self.recipient = recipient
        self.content = content
        self.msg_code = msg_code
        self.seq_num = seq_num
        self.ref_seq_num = ref_seq_num
        self.status = status
        self.timestamp = datetime.utcnow()
    
    @staticmethod
    def from_db_object(db_object):
        if not db_object:
            return None
        return Message(
            sender_id=db_object['sender_id'],
            recipient=db_object['recipient'],
            content=db_object['content'],
            msg_code=db_object.get('msg_code', 'UM169'),
            seq_num=db_object.get('seq_num', 0),
            ref_seq_num=db_object.get('ref_seq_num'),
            status=db_object.get('status', 'sent')
        )
    
    def to_dict(self):
        return {
            'sender_id': str(self.sender_id),
            'recipient': self.recipient,
            'content': self.content,
            'msg_code': self.msg_code,
            'seq_num': self.seq_num,
            'ref_seq_num': self.ref_seq_num,
            'status': self.status,
            'timestamp': self.timestamp
        }
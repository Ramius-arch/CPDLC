from datetime import datetime
from bson import ObjectId

def create_user(username, email, password_hash, role='pilot', mode_s_address=None, facility_designator=None):
    return {
        'username': username,
        'email': email,
        'password_hash': password_hash,
        'role': role,
        'mode_s_address': mode_s_address,
        'facility_designator': facility_designator,
        'created_at': datetime.utcnow()
    }

def create_message(sender_id, recipient, content, msg_code='UM169', seq_num=0, ref_seq_num=None, status='sent'):
    return {
        'sender_id': ObjectId(sender_id),
        'recipient': recipient,
        'content': content,
        'msg_code': msg_code,
        'seq_num': seq_num,
        'ref_seq_num': ref_seq_num,
        'status': status,
        'timestamp': datetime.utcnow()
    }
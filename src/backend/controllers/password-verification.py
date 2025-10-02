from werkzeug.security import check_password_hash

def verify_password(hashed_pw, password):
    return check_password_hash(hashed_pw, password)

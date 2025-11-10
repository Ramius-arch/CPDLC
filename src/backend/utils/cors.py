from functools import wraps
from flask import request, current_app

def cors_preflight(methods=None):
    if methods is None:
        methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = f(*args, **kwargs)

            # Set CORS headers
            headers = resp.headers
            headers['Access-Control-Allow-Origin'] = 'http://localhost:8000'
            headers['Access-Control-Allow-Methods'] = ', '.join(methods)
            headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            headers['Access-Control-Allow-Credentials'] = 'true'

            return resp

        return decorated_function

    return decorator
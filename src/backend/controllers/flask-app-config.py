app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
db.init_app(app)

with app.test_request_context():
    db.create_all()

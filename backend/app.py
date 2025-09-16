from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timezone
import os

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:8080", "http://localhost:8081", "http://localhost:3000", "http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg://jenishs@localhost/library'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Handle preflight requests
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response

# Models
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    isbn = db.Column(db.String(20), unique=True)
    genre = db.Column(db.String(50))
    publication_date = db.Column(db.Date)
    total_copies = db.Column(db.Integer, default=1)
    available_copies = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'isbn': self.isbn,
            'genre': self.genre,
            'publication_date': self.publication_date.isoformat() if self.publication_date else None,
            'total_copies': self.total_copies,
            'available_copies': self.available_copies,
            'created_at': self.created_at.isoformat()
        }

class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    membership_date = db.Column(db.Date, default=lambda: datetime.now(timezone.utc).date())
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'membership_date': self.membership_date.isoformat(),
            'is_active': self.is_active
        }

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    issue_date = db.Column(db.Date, default=lambda: datetime.now(timezone.utc).date())
    due_date = db.Column(db.Date, nullable=False)
    return_date = db.Column(db.Date)
    fine_amount = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='issued')  # issued, returned, overdue

    book = db.relationship('Book', backref='transactions')
    member = db.relationship('Member', backref='transactions')

    def to_dict(self):
        return {
            'id': self.id,
            'book_id': self.book_id,
            'member_id': self.member_id,
            'book_title': self.book.title,
            'member_name': self.member.name,
            'issue_date': self.issue_date.isoformat(),
            'due_date': self.due_date.isoformat(),
            'return_date': self.return_date.isoformat() if self.return_date else None,
            'fine_amount': self.fine_amount,
            'status': self.status
        }

# API Routes

# Books endpoints
@app.route('/api/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([book.to_dict() for book in books])

@app.route('/api/books', methods=['POST'])
def add_book():
    data = request.get_json()
    
    book = Book(
        title=data['title'],
        author=data['author'],
        isbn=data.get('isbn'),
        genre=data.get('genre'),
        publication_date=datetime.strptime(data['publication_date'], '%Y-%m-%d').date() if data.get('publication_date') else None,
        total_copies=data.get('total_copies', 1),
        available_copies=data.get('available_copies', 1)
    )
    
    db.session.add(book)
    db.session.commit()
    
    return jsonify(book.to_dict()), 201

@app.route('/api/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    book = Book.query.get_or_404(book_id)
    data = request.get_json()
    
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.isbn = data.get('isbn', book.isbn)
    book.genre = data.get('genre', book.genre)
    if data.get('publication_date'):
        book.publication_date = datetime.strptime(data['publication_date'], '%Y-%m-%d').date()
    book.total_copies = data.get('total_copies', book.total_copies)
    book.available_copies = data.get('available_copies', book.available_copies)
    
    db.session.commit()
    return jsonify(book.to_dict())

@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()
    return '', 204

# Members endpoints
@app.route('/api/members', methods=['GET'])
def get_members():
    members = Member.query.all()
    return jsonify([member.to_dict() for member in members])

@app.route('/api/members', methods=['POST'])
def add_member():
    data = request.get_json()
    
    member = Member(
        name=data['name'],
        email=data['email'],
        phone=data.get('phone'),
        address=data.get('address')
    )
    
    db.session.add(member)
    db.session.commit()
    
    return jsonify(member.to_dict()), 201

@app.route('/api/members/<int:member_id>', methods=['PUT'])
def update_member(member_id):
    member = Member.query.get_or_404(member_id)
    data = request.get_json()
    
    member.name = data.get('name', member.name)
    member.email = data.get('email', member.email)
    member.phone = data.get('phone', member.phone)
    member.address = data.get('address', member.address)
    member.is_active = data.get('is_active', member.is_active)
    
    db.session.commit()
    return jsonify(member.to_dict())

@app.route('/api/members/<int:member_id>', methods=['DELETE'])
def delete_member(member_id):
    member = Member.query.get_or_404(member_id)
    db.session.delete(member)
    db.session.commit()
    return '', 204

# Transactions endpoints
@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.all()
    return jsonify([transaction.to_dict() for transaction in transactions])

@app.route('/api/transactions/issue', methods=['POST'])
def issue_book():
    data = request.get_json()
    
    book = Book.query.get_or_404(data['book_id'])
    if book.available_copies <= 0:
        return jsonify({'error': 'No copies available'}), 400
    
    from datetime import timedelta
    due_date = datetime.strptime(data['issue_date'], '%Y-%m-%d').date() + timedelta(days=14)
    
    transaction = Transaction(
        book_id=data['book_id'],
        member_id=data['member_id'],
        issue_date=datetime.strptime(data['issue_date'], '%Y-%m-%d').date(),
        due_date=due_date
    )
    
    book.available_copies -= 1
    
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify(transaction.to_dict()), 201

@app.route('/api/transactions/<int:transaction_id>/return', methods=['PUT'])
def return_book(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    data = request.get_json()
    
    return_date = datetime.strptime(data['return_date'], '%Y-%m-%d').date()
    transaction.return_date = return_date
    transaction.status = 'returned'
    
    # Calculate fine if overdue
    if return_date > transaction.due_date:
        days_overdue = (return_date - transaction.due_date).days
        transaction.fine_amount = days_overdue * 1.0  # $1 per day
    
    # Increase available copies
    book = Book.query.get(transaction.book_id)
    book.available_copies += 1
    
    db.session.commit()
    return jsonify(transaction.to_dict())

# Dashboard stats
@app.route('/api/stats', methods=['GET'])
def get_stats():
    total_books = Book.query.count()
    total_members = Member.query.count()
    active_transactions = Transaction.query.filter_by(status='issued').count()
    overdue_books = Transaction.query.filter(
        Transaction.status == 'issued',
        Transaction.due_date < datetime.now(timezone.utc).date()
    ).count()
    
    return jsonify({
        'total_books': total_books,
        'total_members': total_members,
        'active_transactions': active_transactions,
        'overdue_books': overdue_books
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=8000, host='0.0.0.0')
    app.run(debug=True, port=8000, host='0.0.0.0')
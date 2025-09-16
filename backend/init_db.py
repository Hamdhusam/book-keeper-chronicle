from app import app, db, Book, Member
from datetime import datetime

def init_database():
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Add sample data if tables are empty
        if Book.query.count() == 0:
            sample_books = [
                Book(
                    title="The Great Gatsby",
                    author="F. Scott Fitzgerald",
                    isbn="978-0-7432-7356-5",
                    genre="Fiction",
                    publication_date=datetime(1925, 4, 10).date(),
                    total_copies=3,
                    available_copies=3
                ),
                Book(
                    title="To Kill a Mockingbird",
                    author="Harper Lee",
                    isbn="978-0-06-112008-4",
                    genre="Fiction",
                    publication_date=datetime(1960, 7, 11).date(),
                    total_copies=2,
                    available_copies=2
                ),
                Book(
                    title="1984",
                    author="George Orwell",
                    isbn="978-0-452-28423-4",
                    genre="Dystopian Fiction",
                    publication_date=datetime(1949, 6, 8).date(),
                    total_copies=4,
                    available_copies=4
                )
            ]
            
            for book in sample_books:
                db.session.add(book)
        
        if Member.query.count() == 0:
            sample_members = [
                Member(
                    name="John Doe",
                    email="john.doe@email.com",
                    phone="123-456-7890",
                    address="123 Main St, City, State"
                ),
                Member(
                    name="Jane Smith",
                    email="jane.smith@email.com",
                    phone="098-765-4321",
                    address="456 Oak Ave, City, State"
                )
            ]
            
            for member in sample_members:
                db.session.add(member)
        
        db.session.commit()
        print("Database initialized successfully!")

if __name__ == '__main__':
    init_database()
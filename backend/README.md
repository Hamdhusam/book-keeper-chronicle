# Book Keeper Chronicle - Backend

Flask backend API for the Book Keeper Chronicle library management system.

## Prerequisites

1. **PostgreSQL**: Make sure PostgreSQL is installed and running
2. **Python 3.8+**: Ensure Python is installed
3. **Database Setup**: Create a database named `library`

## Database Setup

1. Install PostgreSQL if not already installed:
   ```bash
   # macOS with Homebrew
   brew install postgresql
   brew services start postgresql
   ```

2. Create the database:
   ```bash
   psql -U postgres
   CREATE DATABASE library;
   \q
   ```

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Initialize the database:
   ```bash
   python init_db.py
   ```

5. Run the Flask application:
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Add a new book
- `PUT /api/books/<id>` - Update a book
- `DELETE /api/books/<id>` - Delete a book

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Add a new member
- `PUT /api/members/<id>` - Update a member
- `DELETE /api/members/<id>` - Delete a member

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions/issue` - Issue a book
- `PUT /api/transactions/<id>/return` - Return a book

### Stats
- `GET /api/stats` - Get dashboard statistics

## Configuration

The database connection uses:
- Host: localhost
- Database: library
- Username: postgres
- Password: 708233

You can modify these settings in `app.py` or use environment variables.
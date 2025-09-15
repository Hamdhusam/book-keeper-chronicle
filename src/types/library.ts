export interface Author {
  id: string;
  name: string;
  biography?: string;
  birthDate?: string;
  nationality?: string;
  image?: string;
}

export interface Book {
  id: string;
  title: string;
  authorId: string;
  author: Author;
  isbn: string;
  publishedYear: number;
  genre: string;
  description: string;
  coverImage?: string;
  totalCopies: number;
  availableCopies: number;
  location: string; // Shelf location
}

export interface User {
  id: string;
  name: string;
  email: string;
  membershipDate: string;
  membershipType: 'student' | 'faculty' | 'public';
  maxBorrowLimit: number;
}

export interface BorrowRecord {
  id: string;
  userId: string;
  user: User;
  bookId: string;
  book: Book;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
}
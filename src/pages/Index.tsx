import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { BookCard } from '@/components/BookCard';
import { AuthorCard } from '@/components/AuthorCard';
import { BorrowRecordCard } from '@/components/BorrowRecordCard';
import { mockBooks, mockAuthors, mockBorrowRecords } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import libraryHero from '@/assets/library-hero.jpg';

const Index = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search query
  const filteredBooks = useMemo(() => {
    if (!searchQuery) return mockBooks;
    return mockBooks.filter(book => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredAuthors = useMemo(() => {
    if (!searchQuery) return mockAuthors;
    return mockAuthors.filter(author => 
      author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.nationality?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleBorrowBook = (bookId: string) => {
    const book = mockBooks.find(b => b.id === bookId);
    if (book) {
      toast({
        title: "Book Borrowed Successfully",
        description: `You have borrowed "${book.title}". Due date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
      });
    }
  };

  const handleReturnBook = (recordId: string) => {
    const record = mockBorrowRecords.find(r => r.id === recordId);
    if (record) {
      toast({
        title: "Book Returned Successfully",
        description: `"${record.book.title}" has been returned to the library.`,
      });
    }
  };

  const getAuthorBookCount = (authorId: string) => {
    return mockBooks.filter(book => book.authorId === authorId).length;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'books':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                onBorrow={handleBorrowBook}
              />
            ))}
          </div>
        );
      
      case 'authors':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAuthors.map((author) => (
              <AuthorCard 
                key={author.id} 
                author={author}
                bookCount={getAuthorBookCount(author.id)}
              />
            ))}
          </div>
        );
      
      case 'borrowed':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockBorrowRecords.map((record) => (
              <BorrowRecordCard 
                key={record.id} 
                record={record}
                onReturn={handleReturnBook}
              />
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      {/* Hero Section */}
      {activeTab === 'books' && !searchQuery && (
        <section className="relative h-64 overflow-hidden">
          <img 
            src={libraryHero} 
            alt="Modern library interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl text-white">
                <h2 className="text-4xl font-bold mb-4">Discover Your Next Great Read</h2>
                <p className="text-lg opacity-90">Explore thousands of books from renowned authors across all genres.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {activeTab === 'books' && 'Book Catalog'}
            {activeTab === 'authors' && 'Authors'}
            {activeTab === 'borrowed' && 'Borrowed Books'}
          </h2>
          <p className="text-muted-foreground">
            {activeTab === 'books' && `${filteredBooks.length} books available`}
            {activeTab === 'authors' && `${filteredAuthors.length} authors in our collection`}
            {activeTab === 'borrowed' && `${mockBorrowRecords.length} borrowing records`}
          </p>
        </div>

        {renderContent()}
      </main>
    </div>
  );
};

export default Index;

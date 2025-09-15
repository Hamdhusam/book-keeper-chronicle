import { Book } from '@/types/library';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onBorrow?: (bookId: string) => void;
  showBorrowButton?: boolean;
}

export const BookCard = ({ book, onBorrow, showBorrowButton = true }: BookCardProps) => {
  const isAvailable = book.availableCopies > 0;

  return (
    <Card className="h-full flex flex-col bg-gradient-card shadow-card hover:shadow-book transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="aspect-[3/4] bg-book-page rounded-lg mb-3 overflow-hidden border-l-4 border-book-spine">
          {book.coverImage ? (
            <img 
              src={book.coverImage} 
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-book-spine" />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-1">{book.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <User className="w-3 h-3 mr-1" />
            <span>{book.author.name}</span>
          </div>
          <Badge variant={isAvailable ? "default" : "destructive"} className="text-xs">
            {isAvailable ? `${book.availableCopies} available` : 'Not available'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{book.description}</p>
        
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Published: {book.publishedYear}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            <span>Location: {book.location}</span>
          </div>
        </div>
      </CardContent>

      {showBorrowButton && (
        <CardFooter className="pt-0">
          <Button 
            onClick={() => onBorrow?.(book.id)}
            disabled={!isAvailable}
            className="w-full"
            variant={isAvailable ? "default" : "secondary"}
          >
            {isAvailable ? 'Borrow Book' : 'Not Available'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
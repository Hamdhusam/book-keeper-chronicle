import { Author } from '@/types/library';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCircle, Calendar, Globe } from 'lucide-react';

interface AuthorCardProps {
  author: Author;
  bookCount?: number;
}

export const AuthorCard = ({ author, bookCount = 0 }: AuthorCardProps) => {
  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-book transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="text-center pb-3">
        <div className="w-16 h-16 mx-auto bg-library-warm/10 rounded-full flex items-center justify-center mb-3">
          <UserCircle className="w-10 h-10 text-library-warm" />
        </div>
        <h3 className="font-semibold text-lg text-foreground">{author.name}</h3>
        <Badge variant="secondary" className="w-fit mx-auto">
          {bookCount} {bookCount === 1 ? 'book' : 'books'}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {author.biography && (
          <p className="text-sm text-muted-foreground line-clamp-3">{author.biography}</p>
        )}
        
        <div className="space-y-2 text-xs text-muted-foreground">
          {author.birthDate && (
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-2" />
              <span>Born: {new Date(author.birthDate).getFullYear()}</span>
            </div>
          )}
          {author.nationality && (
            <div className="flex items-center">
              <Globe className="w-3 h-3 mr-2" />
              <span>{author.nationality}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
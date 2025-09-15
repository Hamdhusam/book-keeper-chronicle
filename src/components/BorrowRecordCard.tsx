import { BorrowRecord } from '@/types/library';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, BookOpen, Clock } from 'lucide-react';
import { format, isAfter, parseISO } from 'date-fns';

interface BorrowRecordCardProps {
  record: BorrowRecord;
  onReturn?: (recordId: string) => void;
  showReturnButton?: boolean;
}

export const BorrowRecordCard = ({ record, onReturn, showReturnButton = true }: BorrowRecordCardProps) => {
  const isOverdue = record.status === 'borrowed' && isAfter(new Date(), parseISO(record.dueDate));
  const statusVariant = 
    record.status === 'returned' ? 'default' :
    isOverdue ? 'destructive' : 
    'secondary';

  const getStatusText = () => {
    if (record.status === 'returned') return 'Returned';
    if (isOverdue) return 'Overdue';
    return 'Borrowed';
  };

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-book transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground mb-1">{record.book.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <User className="w-3 h-3 mr-1" />
              <span>{record.user.name}</span>
            </div>
          </div>
          <Badge variant={statusVariant}>
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="w-3 h-3 mr-2" />
            <div>
              <div className="text-xs">Borrowed</div>
              <div className="font-medium">{format(parseISO(record.borrowDate), 'MMM dd, yyyy')}</div>
            </div>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Clock className="w-3 h-3 mr-2" />
            <div>
              <div className="text-xs">Due Date</div>
              <div className={`font-medium ${isOverdue ? 'text-destructive' : ''}`}>
                {format(parseISO(record.dueDate), 'MMM dd, yyyy')}
              </div>
            </div>
          </div>
        </div>

        {record.returnDate && (
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="w-3 h-3 mr-2" />
            <div>
              <span className="text-xs">Returned on </span>
              <span className="font-medium">{format(parseISO(record.returnDate), 'MMM dd, yyyy')}</span>
            </div>
          </div>
        )}

        {showReturnButton && record.status === 'borrowed' && (
          <Button 
            onClick={() => onReturn?.(record.id)}
            className="w-full mt-3"
            variant="outline"
          >
            Mark as Returned
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
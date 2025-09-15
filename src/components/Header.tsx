import { Book, Search, Users, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header = ({ activeTab, setActiveTab, searchQuery, setSearchQuery }: HeaderProps) => {
  const navItems = [
    { id: 'books', label: 'Books', icon: Book },
    { id: 'authors', label: 'Authors', icon: Users },
    { id: 'borrowed', label: 'Borrowed Books', icon: BarChart },
  ];

  return (
    <header className="bg-gradient-hero shadow-card border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
              <Book className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">LibraryHub</h1>
              <p className="text-primary-foreground/80 text-sm">Digital Library Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-background/90 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
        
        <nav className="flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 ${
                  activeTab === item.id 
                    ? 'bg-background/90 text-foreground shadow-sm' 
                    : 'text-primary-foreground/80 hover:bg-background/20 hover:text-primary-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

import { Search, Headphones, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  user: any;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSignOut: () => void;
}

const Header = ({ user, searchQuery, onSearchChange, onSignOut }: HeaderProps) => {
  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2.5 rounded-xl">
              <Headphones className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              AudioVerse
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search stories, authors..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-background border-border focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border hover:bg-accent">
                  <User className="h-4 w-4 mr-2" />
                  {user.user_metadata?.full_name || user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover border-border shadow-lg">
                <DropdownMenuItem onClick={onSignOut} className="hover:bg-accent">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
              Get Pro
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

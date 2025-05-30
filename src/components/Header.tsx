
import { Search, Headphones, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user: any;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSignOut: () => void;
}

const Header = ({ user, searchQuery, onSearchChange, onSignOut }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="glass-morphism border-b border-white/10 sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="luxury-gradient p-3 rounded-2xl animate-glow">
              <Headphones className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold luxury-gradient-text">
              AudioVerse
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Discover stories, authors..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 pr-6 py-4 glass-morphism border-white/20 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 rounded-xl text-lg w-96"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="glass-morphism border-white/20 hover:bg-white/10 text-foreground px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105"
                >
                  <User className="h-5 w-5 mr-3" />
                  {user.user_metadata?.full_name || user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-morphism border-white/20 shadow-2xl rounded-xl p-2 min-w-48">
                <DropdownMenuItem 
                  onClick={onSignOut} 
                  className="hover:bg-white/10 text-foreground px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              className="luxury-button text-white font-semibold text-lg"
              onClick={() => navigate("/pricing")}
            >
              Get Pro
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

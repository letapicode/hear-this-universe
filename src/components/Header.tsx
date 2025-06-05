
import { Search, Headphones, User, LogOut, UserCircle } from "lucide-react";
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
    <header className="huly-glass border-b border-white/10 sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="huly-gradient p-3 rounded-2xl animate-glow">
              <Headphones className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold huly-gradient-text">
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
                className="pl-12 pr-6 py-4 huly-glass border-white/20 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 rounded-xl text-lg w-96"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="huly-glass border-white/20 hover:bg-white/10 text-foreground px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105"
                >
                  <User className="h-5 w-5 mr-3" />
                  {user.user_metadata?.full_name || user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="huly-glass border-white/20 huly-shadow-lg rounded-xl p-2 min-w-48 bg-card/95 backdrop-blur-md z-50">
                <DropdownMenuItem 
                  onClick={() => navigate("/profile")}
                  className="hover:bg-primary/20 hover:text-foreground text-foreground px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer focus:bg-primary/20 focus:text-foreground"
                >
                  <UserCircle className="h-5 w-5 mr-3" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onSignOut} 
                  className="hover:bg-primary/20 hover:text-foreground text-foreground px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer focus:bg-primary/20 focus:text-foreground"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              className="huly-gradient text-white font-semibold text-lg px-6 py-4 rounded-xl hover:scale-105 transition-all duration-200 huly-shadow hover:huly-shadow-hover border-0"
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

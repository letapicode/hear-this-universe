
import { useState, useEffect } from "react";
import { Clock, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RecentItem {
  id: string;
  title: string;
  author: string;
  image: string;
  lastPlayed: Date;
  progress: number;
}

interface RecentlyPlayedProps {
  onPlay: (content: any) => void;
}

const RecentlyPlayed = ({ onPlay }: RecentlyPlayedProps) => {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('recentlyPlayed');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentItems(parsed.map((item: any) => ({
          ...item,
          lastPlayed: new Date(item.lastPlayed)
        })));
      } catch (error) {
        console.error('Failed to load recently played:', error);
      }
    }
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  if (recentItems.length === 0) {
    return (
      <Card className="glass-morphism border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recently Played
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-8">
            No recent listening history
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recently Played
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentItems.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-12 h-12 luxury-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-8 h-8 bg-white/20 rounded"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm truncate">{item.title}</h4>
                <p className="text-xs text-gray-400 truncate">{item.author}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{formatTime(item.lastPlayed)}</span>
                  <span className="text-xs text-purple-400">{Math.round(item.progress)}% complete</span>
                </div>
              </div>
              
              <Button
                onClick={() => onPlay(item)}
                variant="ghost"
                size="sm"
                className="text-white hover:text-purple-400 flex-shrink-0"
              >
                <Play className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentlyPlayed;

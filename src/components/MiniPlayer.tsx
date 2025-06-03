
import { Play, Pause, SkipForward, SkipBack, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MiniPlayerProps {
  content: {
    id: string;
    title: string;
    author: string;
    image: string;
  };
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onMaximize: () => void;
}

const MiniPlayer = ({
  content,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSkipForward,
  onSkipBackward,
  onMaximize
}: MiniPlayerProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="fixed bottom-4 right-4 w-80 glass-morphism border-white/10 luxury-shadow z-40 hover:scale-105 transition-transform">
      <CardContent className="p-4">
        {/* Progress bar */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-3 overflow-hidden">
          <div 
            className="h-full luxury-gradient transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex items-center space-x-3">
          {/* Album art */}
          <div className="w-12 h-12 luxury-gradient rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="w-8 h-8 bg-white/20 rounded animate-pulse"></div>
          </div>

          {/* Content info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white text-sm truncate">{content.title}</h4>
            <p className="text-xs text-gray-400 truncate">{content.author}</p>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkipBackward}
              className="text-white hover:text-purple-400 w-8 h-8 p-0"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={onPlayPause}
              className="luxury-gradient hover:scale-110 rounded-full w-8 h-8 p-0 transition-all"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkipForward}
              className="text-white hover:text-purple-400 w-8 h-8 p-0"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onMaximize}
              className="text-white hover:text-purple-400 w-8 h-8 p-0"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniPlayer;

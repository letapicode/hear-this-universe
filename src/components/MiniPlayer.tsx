
import { Play, Pause, SkipForward, SkipBack, Maximize2, Heart, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

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
  const [volume, setVolume] = useState(80);
  const [isLiked, setIsLiked] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="fixed bottom-6 right-6 w-96 huly-glass border-white/10 huly-shadow-lg z-50 hover:scale-[1.02] transition-all duration-300">
      <CardContent className="p-0">
        {/* Progress bar */}
        <div className="w-full h-1 bg-white/10 rounded-t-xl overflow-hidden">
          <div 
            className="h-full huly-gradient transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Album art */}
            <div className="w-14 h-14 huly-gradient rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden huly-shadow">
              <div className="w-10 h-10 bg-white/20 rounded-lg animate-pulse"></div>
              {isPlaying && (
                <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              )}
            </div>

            {/* Content info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white huly-text-sm truncate">{content.title}</h4>
              <p className="text-xs text-white/60 truncate">{content.author}</p>
              <div className="flex items-center justify-between text-xs text-white/50 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
                className="w-8 h-8 p-0 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onSkipBackward}
                className="w-8 h-8 p-0 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={onPlayPause}
                className="huly-gradient hover:scale-110 rounded-full w-10 h-10 p-0 transition-all duration-200 huly-shadow text-white border-0"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onSkipForward}
                className="w-8 h-8 p-0 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onMaximize}
                className="w-8 h-8 p-0 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 mt-3 px-2">
            <Volume2 className="h-4 w-4 text-white/60" />
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-white/60 w-8 text-right">{volume}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniPlayer;

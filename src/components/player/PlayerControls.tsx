
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipForward: () => void;
  onSkipBack: () => void;
}

const PlayerControls = ({ isPlaying, onPlayPause, onSkipForward, onSkipBack }: PlayerControlsProps) => {
  return (
    <div className="flex items-center justify-center space-x-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={onSkipBack}
        className="text-white hover:text-purple-400 transition-colors"
      >
        <SkipBack className="h-6 w-6" />
      </Button>
      
      <Button
        onClick={onPlayPause}
        className="luxury-gradient hover:scale-105 rounded-full w-16 h-16 luxury-shadow transition-all duration-300"
      >
        {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onSkipForward}
        className="text-white hover:text-purple-400 transition-colors"
      >
        <SkipForward className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default PlayerControls;

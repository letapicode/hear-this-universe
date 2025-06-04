
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
        className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
      >
        <SkipBack className="h-6 w-6" />
      </Button>
      
      <Button
        onClick={onPlayPause}
        className="huly-gradient hover:scale-105 rounded-full w-16 h-16 huly-shadow transition-all duration-300 text-white border-0"
      >
        {isPlaying ? <Pause className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-white ml-1" />}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onSkipForward}
        className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
      >
        <SkipForward className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default PlayerControls;

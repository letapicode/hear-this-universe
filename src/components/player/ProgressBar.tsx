
import { Slider } from "@/components/ui/slider";
import { useState, useRef } from "react";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  buffered?: number;
  chapters?: Array<{ title: string; time: number }>;
}

const ProgressBar = ({ 
  currentTime, 
  duration, 
  onSeek, 
  buffered = 0,
  chapters = []
}: ProgressBarProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const time = percentage * duration;
    
    setHoverTime(time);
    setHoverPosition(x);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercentage = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div className="space-y-2">
      <div 
        ref={progressRef}
        className="relative group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Hover time tooltip */}
        {hoverTime !== null && (
          <div 
            className="absolute -top-8 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none z-10"
            style={{ left: hoverPosition }}
          >
            {formatTime(hoverTime)}
          </div>
        )}

        {/* Chapter markers */}
        {chapters.map((chapter, index) => (
          <div
            key={index}
            className="absolute top-0 w-0.5 h-full bg-white/30 pointer-events-none z-20"
            style={{ left: `${(chapter.time / duration) * 100}%` }}
            title={chapter.title}
          />
        ))}

        <Slider
          value={[currentTime]}
          max={duration}
          step={0.1}
          onValueChange={(value) => onSeek(value[0])}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          className="w-full relative"
        />

        {/* Custom progress visualization */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Buffered progress */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-white/20 rounded-full -translate-y-1/2"
            style={{ width: `${bufferedPercentage}%` }}
          />
          
          {/* Current progress */}
          <div 
            className="absolute top-1/2 left-0 h-1 huly-gradient rounded-full -translate-y-1/2 transition-all duration-150"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs text-white/60">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;

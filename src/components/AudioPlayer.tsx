
import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

interface AudioPlayerProps {
  content: {
    id: number;
    title: string;
    author: string;
    image: string;
  };
  isPlaying: boolean;
  onPlayPause: () => void;
  onClose: () => void;
}

const AudioPlayer = ({ content, isPlaying, onPlayPause, onClose }: AudioPlayerProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes for demo
  const [volume, setVolume] = useState([80]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Simulate audio progress for demo
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  const skipForward = () => {
    setCurrentTime(prev => Math.min(prev + 15, duration));
  };

  const skipBack = () => {
    setCurrentTime(prev => Math.max(prev - 15, 0));
  };

  return (
    <Card className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 rounded-t-lg z-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <div className="w-12 h-12 bg-white/20 rounded-md"></div>
            </div>
            <div>
              <h4 className="font-semibold text-white">{content.title}</h4>
              <p className="text-sm text-gray-400">{content.author}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={skipBack}
            className="text-white hover:text-purple-400"
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={onPlayPause}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full w-12 h-12"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={skipForward}
            className="text-white hover:text-purple-400"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSpeedChange}
            className="text-gray-400 hover:text-white text-xs"
          >
            {playbackSpeed}x
          </Button>
          
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-gray-400" />
            <Slider
              value={volume}
              max={100}
              step={1}
              onValueChange={setVolume}
              className="w-20"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;

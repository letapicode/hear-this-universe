import { useState, useRef, useEffect } from "react";
import { X, Settings, RotateCcw, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import PlayerControls from "./player/PlayerControls";
import VolumeControl from "./player/VolumeControl";
import SpeedControl from "./player/SpeedControl";
import BookmarkManager from "./player/BookmarkManager";
import SleepTimer from "./player/SleepTimer";

interface AudioPlayerProps {
  content: {
    id: string;
    title: string;
    author: string;
    image: string;
  };
  isPlaying: boolean;
  onPlayPause: () => void;
  onClose: () => void;
}

interface BookmarkData {
  time: number;
  note?: string;
}

const AudioPlayer = ({ content, isPlaying, onPlayPause, onClose }: AudioPlayerProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolume] = useState([80]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [sleepTimer, setSleepTimer] = useState(0);
  const [sleepTimerActive, setSleepTimerActive] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [lastPosition, setLastPosition] = useState(0);
  
  const sleepTimerRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + playbackSpeed;
          if (newTime >= duration) {
            return 0;
          }
          
          if (autoSave && Math.floor(newTime) % 30 === 0) {
            setLastPosition(newTime);
            localStorage.setItem(`audio_progress_${content.id}`, newTime.toString());
          }
          
          return newTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration, playbackSpeed, autoSave, content.id]);

  useEffect(() => {
    const savedPosition = localStorage.getItem(`audio_progress_${content.id}`);
    if (savedPosition && autoSave) {
      const position = parseFloat(savedPosition);
      setCurrentTime(position);
      setLastPosition(position);
    }
  }, [content.id, autoSave]);

  useEffect(() => {
    if (sleepTimerActive && sleepTimer > 0) {
      sleepTimerRef.current = setTimeout(() => {
        onPlayPause();
        setSleepTimerActive(false);
        toast({
          title: "Sleep Timer",
          description: "Audio paused automatically",
        });
      }, sleepTimer * 60 * 1000);
    }

    return () => {
      if (sleepTimerRef.current) {
        clearTimeout(sleepTimerRef.current);
      }
    };
  }, [sleepTimerActive, sleepTimer, onPlayPause, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (autoSave) {
      localStorage.setItem(`audio_progress_${content.id}`, newTime.toString());
    }
  };

  const handleSpeedChange = (speed: string) => {
    setPlaybackSpeed(parseFloat(speed));
    toast({
      title: "Playback Speed",
      description: `Set to ${speed}x`,
    });
  };

  const skipForward = () => {
    setCurrentTime(prev => Math.min(prev + 15, duration));
  };

  const skipBack = () => {
    setCurrentTime(prev => Math.max(prev - 15, 0));
  };

  const handleAddBookmark = (bookmark: BookmarkData) => {
    setBookmarks(prev => [...prev, bookmark].sort((a, b) => a.time - b.time));
  };

  const handleRemoveBookmark = (time: number) => {
    setBookmarks(prev => prev.filter(bookmark => Math.abs(bookmark.time - time) > 1));
  };

  const handleJumpToBookmark = (time: number) => {
    setCurrentTime(time);
  };

  const resumeFromLastPosition = () => {
    setCurrentTime(lastPosition);
    toast({
      title: "Resumed",
      description: `Jumped to ${formatTime(lastPosition)}`,
    });
  };

  const setSleepTimerMinutes = (minutes: number) => {
    setSleepTimer(minutes);
    setSleepTimerActive(minutes > 0);
    if (minutes > 0) {
      toast({
        title: "Sleep Timer Set",
        description: `Audio will pause in ${minutes} minutes`,
      });
    }
  };

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <Card className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl z-50 luxury-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 luxury-gradient rounded-xl flex items-center justify-center luxury-shadow">
              <div className="w-12 h-12 bg-white/20 rounded-lg animate-pulse"></div>
            </div>
            <div>
              <h4 className="font-semibold text-white text-lg">{content.title}</h4>
              <p className="text-sm text-gray-300">{content.author}</p>
              {lastPosition > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resumeFromLastPosition}
                  className="text-xs text-purple-400 hover:text-purple-300 p-0 h-auto mt-1"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Resume from {formatTime(lastPosition)}
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Popover open={showSettings} onOpenChange={setShowSettings}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 glass-morphism border-white/20">
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Player Settings</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Auto-save progress</span>
                    <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-300 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="relative">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div 
              className="absolute top-1/2 left-0 h-1 luxury-gradient rounded-full -translate-y-1/2 pointer-events-none"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="mb-6">
          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={onPlayPause}
            onSkipForward={skipForward}
            onSkipBack={skipBack}
          />
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between mb-6">
          <SpeedControl
            playbackSpeed={playbackSpeed}
            onSpeedChange={handleSpeedChange}
          />
          
          <SleepTimer
            sleepTimer={sleepTimer}
            sleepTimerActive={sleepTimerActive}
            onSetTimer={setSleepTimerMinutes}
          />
          
          <VolumeControl
            volume={volume}
            onVolumeChange={setVolume}
          />
        </div>

        {/* Bookmarks */}
        <BookmarkManager
          bookmarks={bookmarks}
          currentTime={currentTime}
          duration={duration}
          onAddBookmark={handleAddBookmark}
          onRemoveBookmark={handleRemoveBookmark}
          onJumpToBookmark={handleJumpToBookmark}
        />
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;

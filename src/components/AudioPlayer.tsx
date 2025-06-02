import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, X, Clock, Bookmark, RotateCcw, Settings, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  content: {
    id: string; // Changed from number to string to match UUID
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
  const [sleepTimer, setSleepTimer] = useState(0); // minutes
  const [sleepTimerActive, setSleepTimerActive] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [lastPosition, setLastPosition] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const sleepTimerRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Simulate audio progress for demo
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + playbackSpeed;
          if (newTime >= duration) {
            return 0;
          }
          
          // Auto-save progress every 30 seconds
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

  // Load saved position on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem(`audio_progress_${content.id}`);
    if (savedPosition && autoSave) {
      const position = parseFloat(savedPosition);
      setCurrentTime(position);
      setLastPosition(position);
    }
  }, [content.id, autoSave]);

  // Sleep timer functionality
  useEffect(() => {
    if (sleepTimerActive && sleepTimer > 0) {
      sleepTimerRef.current = setTimeout(() => {
        onPlayPause(); // Pause the audio
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

  const addBookmark = () => {
    if (!bookmarks.includes(currentTime)) {
      setBookmarks(prev => [...prev, currentTime].sort((a, b) => a - b));
      toast({
        title: "Bookmark Added",
        description: `Added at ${formatTime(currentTime)}`,
      });
    }
  };

  const jumpToBookmark = (time: number) => {
    setCurrentTime(time);
  };

  const removeBookmark = (time: number) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark !== time));
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
        {/* Header with content info and controls */}
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
            {/* Settings */}
            <Popover open={showSettings} onOpenChange={setShowSettings}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white"
                >
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
                  
                  <div>
                    <span className="text-sm text-gray-300 block mb-2">Sleep Timer</span>
                    <RadioGroup
                      value={sleepTimer.toString()}
                      onValueChange={(value) => setSleepTimerMinutes(parseInt(value))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="timer-off" />
                        <label htmlFor="timer-off" className="text-sm text-gray-300">Off</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="15" id="timer-15" />
                        <label htmlFor="timer-15" className="text-sm text-gray-300">15 minutes</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="30" id="timer-30" />
                        <label htmlFor="timer-30" className="text-sm text-gray-300">30 minutes</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="60" id="timer-60" />
                        <label htmlFor="timer-60" className="text-sm text-gray-300">1 hour</label>
                      </div>
                    </RadioGroup>
                    {sleepTimerActive && (
                      <div className="flex items-center mt-2 text-orange-400">
                        <Moon className="h-4 w-4 mr-1" />
                        <span className="text-xs">Timer active: {sleepTimer}min</span>
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar with enhanced styling */}
        <div className="mb-6">
          <div className="relative">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            {/* Progress background gradient */}
            <div 
              className="absolute top-1/2 left-0 h-1 luxury-gradient rounded-full -translate-y-1/2 pointer-events-none"
              style={{ width: `${progressPercentage}%` }}
            />
            {/* Bookmarks on progress bar */}
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark}
                className="absolute top-1/2 w-2 h-2 bg-yellow-400 rounded-full -translate-y-1/2 -translate-x-1 cursor-pointer hover:scale-125 transition-transform"
                style={{ left: `${(bookmark / duration) * 100}%` }}
                onClick={() => jumpToBookmark(bookmark)}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-8 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={skipBack}
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
            onClick={skipForward}
            className="text-white hover:text-purple-400 transition-colors"
          >
            <SkipForward className="h-6 w-6" />
          </Button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between">
          {/* Speed Control */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white glass-morphism px-4 py-2"
              >
                {playbackSpeed}x
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 glass-morphism border-white/20">
              <div className="space-y-2">
                <h4 className="font-semibold text-white text-sm">Playback Speed</h4>
                <RadioGroup
                  value={playbackSpeed.toString()}
                  onValueChange={handleSpeedChange}
                >
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <div key={speed} className="flex items-center space-x-2">
                      <RadioGroupItem value={speed.toString()} id={`speed-${speed}`} />
                      <label htmlFor={`speed-${speed}`} className="text-sm text-gray-300">
                        {speed}x
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </PopoverContent>
          </Popover>

          {/* Bookmark */}
          <Button
            variant="ghost"
            size="sm"
            onClick={addBookmark}
            className="text-gray-300 hover:text-yellow-400 glass-morphism"
          >
            <Bookmark className="h-4 w-4" />
          </Button>

          {/* Sleep Timer Indicator */}
          {sleepTimerActive && (
            <div className="flex items-center text-orange-400 glass-morphism px-3 py-1 rounded-full">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-xs">{sleepTimer}min</span>
            </div>
          )}
          
          {/* Volume Control */}
          <div className="flex items-center space-x-3">
            <Volume2 className="h-4 w-4 text-gray-400" />
            <Slider
              value={volume}
              max={100}
              step={1}
              onValueChange={setVolume}
              className="w-24"
            />
          </div>
        </div>

        {/* Bookmarks List */}
        {bookmarks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h5 className="text-sm font-medium text-gray-300 mb-2">Bookmarks</h5>
            <div className="flex flex-wrap gap-2">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark}
                  className="flex items-center glass-morphism rounded-full px-3 py-1"
                >
                  <button
                    onClick={() => jumpToBookmark(bookmark)}
                    className="text-xs text-yellow-400 hover:text-yellow-300 mr-2"
                  >
                    {formatTime(bookmark)}
                  </button>
                  <button
                    onClick={() => removeBookmark(bookmark)}
                    className="text-xs text-gray-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;

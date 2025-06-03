
import { useState } from "react";
import { Clock, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SleepTimerProps {
  sleepTimer: number;
  sleepTimerActive: boolean;
  onSetTimer: (minutes: number) => void;
}

const SleepTimer = ({ sleepTimer, sleepTimerActive, onSetTimer }: SleepTimerProps) => {
  const [customMinutes, setCustomMinutes] = useState("");

  const presetTimes = [0, 5, 10, 15, 30, 45, 60, 90, 120];

  const handleCustomTimer = () => {
    const minutes = parseInt(customMinutes);
    if (minutes > 0 && minutes <= 300) { // Max 5 hours
      onSetTimer(minutes);
      setCustomMinutes("");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`glass-morphism ${sleepTimerActive ? 'text-orange-400' : 'text-gray-300'}`}
        >
          <Clock className="h-4 w-4 mr-1" />
          {sleepTimerActive ? `${sleepTimer}m` : 'Timer'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 glass-morphism border-white/20">
        <div className="space-y-4">
          <h4 className="font-semibold text-white text-sm flex items-center">
            <Moon className="h-4 w-4 mr-2" />
            Sleep Timer
          </h4>
          
          <RadioGroup
            value={sleepTimer.toString()}
            onValueChange={(value) => onSetTimer(parseInt(value))}
          >
            {presetTimes.map((time) => (
              <div key={time} className="flex items-center space-x-2">
                <RadioGroupItem value={time.toString()} id={`timer-${time}`} />
                <label htmlFor={`timer-${time}`} className="text-sm text-gray-300">
                  {time === 0 ? 'Off' : `${time} minutes`}
                </label>
              </div>
            ))}
          </RadioGroup>

          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="text-sm text-gray-300">Custom duration</label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Minutes"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                min="1"
                max="300"
              />
              <Button onClick={handleCustomTimer} size="sm" className="luxury-gradient">
                Set
              </Button>
            </div>
          </div>

          {sleepTimerActive && (
            <div className="flex items-center justify-center text-orange-400 bg-orange-500/10 rounded-lg p-2">
              <Moon className="h-4 w-4 mr-2" />
              <span className="text-sm">Timer active: {sleepTimer} minutes</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SleepTimer;

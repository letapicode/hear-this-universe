
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SpeedControlProps {
  playbackSpeed: number;
  onSpeedChange: (speed: string) => void;
}

const SpeedControl = ({ playbackSpeed, onSpeedChange }: SpeedControlProps) => {
  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];

  return (
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
            onValueChange={onSpeedChange}
          >
            {speeds.map((speed) => (
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
  );
};

export default SpeedControl;

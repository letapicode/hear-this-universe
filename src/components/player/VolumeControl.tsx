
import { Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VolumeControlProps {
  volume: number[];
  onVolumeChange: (value: number[]) => void;
}

const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  return (
    <div className="flex items-center space-x-3">
      <Volume2 className="h-4 w-4 text-gray-400" />
      <Slider
        value={volume}
        max={100}
        step={1}
        onValueChange={onVolumeChange}
        className="w-24"
      />
    </div>
  );
};

export default VolumeControl;

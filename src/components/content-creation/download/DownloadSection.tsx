
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import DownloadOption from "./DownloadOption";

interface DownloadOption {
  type: 'video' | 'audio' | 'thumbnail';
  format: string;
  quality: string;
  size: string;
  url: string;
}

interface DownloadSectionProps {
  type: string;
  options: DownloadOption[];
  title: string;
  audioUrl?: string;
  onDownloadComplete: (downloadId: string) => void;
}

const DownloadSection = ({ 
  type, 
  options, 
  title, 
  audioUrl, 
  onDownloadComplete 
}: DownloadSectionProps) => {
  const getIcon = () => {
    switch (type) {
      case 'video':
        return <Download className="h-4 w-4" />;
      case 'audio':
        return <Download className="h-4 w-4" />;
      case 'thumbnail':
        return <Download className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
        {getIcon()}
        {type} Files
      </h3>
      
      <div className="grid gap-3">
        {options.map((option, index) => {
          const isDisabled = !option.url || (option.type === 'audio' && !audioUrl);
          
          if (isDisabled) return null;
          
          return (
            <DownloadOption
              key={index}
              {...option}
              title={title}
              onDownloadComplete={onDownloadComplete}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DownloadSection;

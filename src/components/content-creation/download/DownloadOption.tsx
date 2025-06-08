
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileVideo, 
  FileAudio, 
  Image,
  CheckCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface DownloadOptionProps {
  type: 'video' | 'audio' | 'thumbnail';
  format: string;
  quality: string;
  size: string;
  url: string;
  title: string;
  onDownloadComplete: (downloadId: string) => void;
}

const DownloadOption = ({ 
  type, 
  format, 
  quality, 
  size, 
  url, 
  title,
  onDownloadComplete 
}: DownloadOptionProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const downloadId = `${type}-${format}-${quality}`;

  const getIcon = () => {
    switch (type) {
      case 'video':
        return <FileVideo className="h-4 w-4" />;
      case 'audio':
        return <FileAudio className="h-4 w-4" />;
      case 'thumbnail':
        return <Image className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'video':
        return 'bg-blue-500/20 text-blue-400';
      case 'audio':
        return 'bg-green-500/20 text-green-400';
      case 'thumbnail':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleDownload = async () => {
    if (!url) {
      toast.error("Download URL not available");
      return;
    }

    setIsDownloading(true);
    setProgress(0);

    try {
      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.${format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsCompleted(true);
      onDownloadComplete(downloadId);
      toast.success(`${type} downloaded successfully!`);

    } catch (error) {
      toast.error("Download failed");
    } finally {
      setIsDownloading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 huly-glass border border-white/10 rounded-lg">
      <div className="flex items-center gap-3">
        <Badge className={getTypeColor()}>
          {format}
        </Badge>
        <div>
          <div className="font-medium">{quality}</div>
          <div className="text-sm text-muted-foreground">{size}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isCompleted && (
          <CheckCircle className="h-5 w-5 text-green-400" />
        )}
        
        <Button
          onClick={handleDownload}
          disabled={isDownloading || !url}
          variant="outline"
          size="sm"
          className="border-white/20 hover:bg-white/10 hover:text-white"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {progress}%
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DownloadOption;

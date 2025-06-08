
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  FileVideo, 
  FileAudio, 
  Image,
  CheckCircle,
  Loader2,
  HardDrive
} from "lucide-react";
import { toast } from "sonner";

interface DownloadOption {
  type: 'video' | 'audio' | 'thumbnail';
  format: string;
  quality: string;
  size: string;
  url: string;
}

interface GeneratedVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  tags: string[];
  duration: number;
}

interface DownloadManagerProps {
  video: GeneratedVideo;
  audioUrl?: string;
}

const DownloadManager = ({ video, audioUrl }: DownloadManagerProps) => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [completedDownloads, setCompletedDownloads] = useState<Set<string>>(new Set());

  const downloadOptions: DownloadOption[] = [
    {
      type: 'video',
      format: 'MP4',
      quality: '1080p',
      size: '245 MB',
      url: video.videoUrl
    },
    {
      type: 'video',
      format: 'MP4',
      quality: '720p',
      size: '156 MB',
      url: video.videoUrl
    },
    {
      type: 'video',
      format: 'WEBM',
      quality: '1080p',
      size: '198 MB',
      url: video.videoUrl
    },
    {
      type: 'audio',
      format: 'MP3',
      quality: '320kbps',
      size: '12 MB',
      url: audioUrl || ''
    },
    {
      type: 'audio',
      format: 'WAV',
      quality: 'Lossless',
      size: '45 MB',
      url: audioUrl || ''
    },
    {
      type: 'thumbnail',
      format: 'PNG',
      quality: '1920x1080',
      size: '2.1 MB',
      url: video.thumbnailUrl
    },
    {
      type: 'thumbnail',
      format: 'JPG',
      quality: '1920x1080',
      size: '854 KB',
      url: video.thumbnailUrl
    }
  ];

  const handleDownload = async (option: DownloadOption) => {
    const downloadId = `${option.type}-${option.format}-${option.quality}`;
    
    if (!option.url) {
      toast.error("Download URL not available");
      return;
    }

    setDownloading(downloadId);
    setDownloadProgress(0);

    try {
      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setDownloadProgress(i);
      }

      // Create download link
      const link = document.createElement('a');
      link.href = option.url;
      link.download = `${video.title}.${option.format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setCompletedDownloads(prev => new Set([...prev, downloadId]));
      toast.success(`${option.type} downloaded successfully!`);

    } catch (error) {
      toast.error("Download failed");
    } finally {
      setDownloading(null);
      setDownloadProgress(0);
    }
  };

  const getIcon = (type: string) => {
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

  const getTypeColor = (type: string) => {
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

  const groupedOptions = downloadOptions.reduce((acc, option) => {
    if (!acc[option.type]) {
      acc[option.type] = [];
    }
    acc[option.type].push(option);
    return acc;
  }, {} as Record<string, DownloadOption[]>);

  return (
    <Card className="huly-glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 huly-gradient-text">
          <HardDrive className="h-5 w-5" />
          Download Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedOptions).map(([type, options]) => (
          <div key={type} className="space-y-3">
            <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
              {getIcon(type)}
              {type} Files
            </h3>
            
            <div className="grid gap-3">
              {options.map((option, index) => {
                const downloadId = `${option.type}-${option.format}-${option.quality}`;
                const isDownloading = downloading === downloadId;
                const isCompleted = completedDownloads.has(downloadId);
                const isDisabled = !option.url || (option.type === 'audio' && !audioUrl);

                return (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 huly-glass border border-white/10 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={getTypeColor(option.type)}>
                        {option.format}
                      </Badge>
                      <div>
                        <div className="font-medium">{option.quality}</div>
                        <div className="text-sm text-muted-foreground">{option.size}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                      
                      <Button
                        onClick={() => handleDownload(option)}
                        disabled={isDownloading || isDisabled}
                        variant="outline"
                        size="sm"
                        className="border-white/20"
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {downloadProgress}%
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
              })}
            </div>
          </div>
        ))}

        {downloading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Downloading...</span>
              <span>{downloadProgress}%</span>
            </div>
            <Progress value={downloadProgress} className="w-full" />
          </div>
        )}

        <div className="pt-4 border-t border-white/10">
          <Button
            onClick={() => {
              // Download all available files
              downloadOptions.forEach(option => {
                if (option.url && (option.type !== 'audio' || audioUrl)) {
                  setTimeout(() => handleDownload(option), Math.random() * 1000);
                }
              });
            }}
            className="w-full huly-gradient text-white border-0"
            disabled={!!downloading}
          >
            <Download className="h-4 w-4 mr-2" />
            Download All Files
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadManager;

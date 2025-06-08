
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, HardDrive } from "lucide-react";
import { toast } from "sonner";
import DownloadSection from "./download/DownloadSection";

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

  const handleDownloadComplete = (downloadId: string) => {
    setCompletedDownloads(prev => new Set([...prev, downloadId]));
  };

  const handleDownloadAll = async () => {
    setDownloading('all');
    setDownloadProgress(0);

    try {
      const validOptions = downloadOptions.filter(option => 
        option.url && (option.type !== 'audio' || audioUrl)
      );

      for (let i = 0; i < validOptions.length; i++) {
        const option = validOptions[i];
        const link = document.createElement('a');
        link.href = option.url;
        link.download = `${video.title}.${option.format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloadProgress(((i + 1) / validOptions.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      toast.success("All files downloaded successfully!");
    } catch (error) {
      toast.error("Download failed");
    } finally {
      setDownloading(null);
      setDownloadProgress(0);
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
          <DownloadSection
            key={type}
            type={type}
            options={options}
            title={video.title}
            audioUrl={audioUrl}
            onDownloadComplete={handleDownloadComplete}
          />
        ))}

        {downloading === 'all' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Downloading all files...</span>
              <span>{Math.round(downloadProgress)}%</span>
            </div>
            <Progress value={downloadProgress} className="w-full" />
          </div>
        )}

        <div className="pt-4 border-t border-white/10">
          <Button
            onClick={handleDownloadAll}
            className="w-full huly-gradient text-white border-0 hover:opacity-90"
            disabled={downloading === 'all'}
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

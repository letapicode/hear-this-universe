
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Youtube, 
  Upload, 
  Image, 
  Sparkles,
  Loader2,
  CheckCircle,
  ExternalLink,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

interface YouTubeSettings {
  title: string;
  description: string;
  tags: string[];
  category: string;
  privacy: 'public' | 'unlisted' | 'private';
  thumbnail: string;
  generateThumbnail: boolean;
  thumbnailPrompt: string;
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

interface YouTubeUploaderProps {
  video: GeneratedVideo;
  podcastScript: string;
}

const YouTubeUploader = ({ video, podcastScript }: YouTubeUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [settings, setSettings] = useState<YouTubeSettings>({
    title: video.title,
    description: `${video.description}\n\nGenerated using AI technology.\n\nTranscript:\n${podcastScript.substring(0, 500)}...`,
    tags: [...video.tags, 'podcast', 'ai-generated', 'audio'],
    category: '22', // People & Blogs
    privacy: 'public',
    thumbnail: video.thumbnailUrl,
    generateThumbnail: true,
    thumbnailPrompt: `Professional podcast thumbnail for "${video.title}" with modern design`
  });

  const categories = [
    { id: '1', name: 'Film & Animation' },
    { id: '2', name: 'Autos & Vehicles' },
    { id: '10', name: 'Music' },
    { id: '15', name: 'Pets & Animals' },
    { id: '17', name: 'Sports' },
    { id: '19', name: 'Travel & Events' },
    { id: '20', name: 'Gaming' },
    { id: '22', name: 'People & Blogs' },
    { id: '23', name: 'Comedy' },
    { id: '24', name: 'Entertainment' },
    { id: '25', name: 'News & Politics' },
    { id: '26', name: 'Howto & Style' },
    { id: '27', name: 'Education' },
    { id: '28', name: 'Science & Technology' }
  ];

  const generateThumbnail = async () => {
    setIsGeneratingThumbnail(true);
    try {
      // Mock AI thumbnail generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newThumbnail = `https://picsum.photos/1280/720?random=${Date.now()}`;
      setSettings({...settings, thumbnail: newThumbnail});
      toast.success("AI thumbnail generated successfully!");
      
    } catch (error) {
      toast.error("Failed to generate thumbnail");
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  const uploadToYouTube = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const steps = [
        { progress: 20, message: "Preparing video file..." },
        { progress: 40, message: "Uploading to YouTube..." },
        { progress: 60, message: "Processing video..." },
        { progress: 80, message: "Setting metadata..." },
        { progress: 100, message: "Upload complete!" }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setUploadProgress(step.progress);
        toast.info(step.message);
      }

      // Mock successful upload
      const mockUrl = `https://www.youtube.com/watch?v=${Math.random().toString(36).substring(7)}`;
      setUploadedUrl(mockUrl);
      toast.success("Video uploaded to YouTube successfully!");

    } catch (error) {
      toast.error("Failed to upload to YouTube");
    } finally {
      setIsUploading(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !settings.tags.includes(tag)) {
      setSettings({
        ...settings,
        tags: [...settings.tags, tag]
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSettings({
      ...settings,
      tags: settings.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="space-y-6">
      <Card className="huly-glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 huly-gradient-text">
            <Youtube className="h-5 w-5" />
            YouTube Upload Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Video Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video 
                  controls 
                  className="w-full h-full"
                  poster={settings.thumbnail}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                </video>
              </div>
            </div>

            <div className="space-y-4">
              {/* Thumbnail Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Thumbnail</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.generateThumbnail}
                      onCheckedChange={(checked) => 
                        setSettings({...settings, generateThumbnail: checked})
                      }
                    />
                    <span className="text-sm">AI Generate</span>
                  </div>
                </div>

                {settings.generateThumbnail && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Describe the thumbnail you want..."
                      value={settings.thumbnailPrompt}
                      onChange={(e) => setSettings({...settings, thumbnailPrompt: e.target.value})}
                      className="huly-glass border-white/20"
                      rows={2}
                    />
                    <Button
                      onClick={generateThumbnail}
                      disabled={isGeneratingThumbnail}
                      variant="outline"
                      className="w-full border-white/20"
                    >
                      {isGeneratingThumbnail ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate AI Thumbnail
                        </>
                      )}
                    </Button>
                  </div>
                )}

                <div className="aspect-video bg-black rounded-lg overflow-hidden border-2 border-white/10">
                  <img 
                    src={settings.thumbnail} 
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Upload Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={settings.title}
                  onChange={(e) => setSettings({...settings, title: e.target.value})}
                  className="huly-glass border-white/20"
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={settings.category} 
                  onValueChange={(value) => setSettings({...settings, category: value})}
                >
                  <SelectTrigger className="huly-glass border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Privacy</Label>
                <Select 
                  value={settings.privacy} 
                  onValueChange={(value: any) => setSettings({...settings, privacy: value})}
                >
                  <SelectTrigger className="huly-glass border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Public
                      </div>
                    </SelectItem>
                    <SelectItem value="unlisted">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4" />
                        Unlisted
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4" />
                        Private
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={settings.description}
                  onChange={(e) => setSettings({...settings, description: e.target.value})}
                  className="huly-glass border-white/20 min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {settings.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Press Enter to add tags"
                  className="huly-glass border-white/20"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Upload Button and Progress */}
          <div className="space-y-4">
            {!uploadedUrl ? (
              <>
                <Button 
                  onClick={uploadToYouTube}
                  disabled={isUploading || !settings.title}
                  className="w-full huly-gradient text-white border-0"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading to YouTube...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload to YouTube
                    </>
                  )}
                </Button>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Upload Progress</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Successfully uploaded to YouTube!</span>
                </div>
                <Button
                  onClick={() => window.open(uploadedUrl, '_blank')}
                  variant="outline"
                  className="border-white/20"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on YouTube
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubeUploader;

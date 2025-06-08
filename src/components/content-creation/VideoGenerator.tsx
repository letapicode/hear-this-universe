
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, 
  Image, 
  Upload, 
  Download, 
  Youtube, 
  Sparkles,
  Play,
  Loader2,
  Eye,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface VideoSettings {
  style: 'static' | 'animated' | 'slideshow';
  backgroundType: 'image' | 'video' | 'ai-generated';
  backgroundPrompt: string;
  duration: number;
  resolution: '720p' | '1080p' | '4K';
  aspectRatio: '16:9' | '9:16' | '1:1';
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

interface VideoGeneratorProps {
  podcastScript: string;
  podcastAudioUrl: string;
  podcastTitle: string;
  onVideoGenerated?: (video: GeneratedVideo) => void;
}

const VideoGenerator = ({ 
  podcastScript, 
  podcastAudioUrl, 
  podcastTitle,
  onVideoGenerated 
}: VideoGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [settings, setSettings] = useState<VideoSettings>({
    style: 'static',
    backgroundType: 'ai-generated',
    backgroundPrompt: '',
    duration: 0,
    resolution: '1080p',
    aspectRatio: '16:9'
  });

  const videoStyles = [
    { id: 'static', name: 'Static Image', description: 'Single background image with waveform' },
    { id: 'animated', name: 'Animated Background', description: 'Moving background with visual effects' },
    { id: 'slideshow', name: 'Slideshow', description: 'Multiple images synced to content' }
  ];

  const generateVideo = async () => {
    if (!podcastAudioUrl) {
      toast.error("No podcast audio available to generate video");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    
    try {
      // Step 1: Generate background image/video
      setCurrentStep("Generating background visuals...");
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 2: Create thumbnail
      setCurrentStep("Creating AI thumbnail...");
      setProgress(40);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 3: Process audio waveform
      setCurrentStep("Processing audio waveform...");
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 4: Render video
      setCurrentStep("Rendering final video...");
      setProgress(80);
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Step 5: Complete
      setCurrentStep("Finalizing...");
      setProgress(100);
      
      const mockVideo: GeneratedVideo = {
        id: Date.now().toString(),
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnailUrl: "https://picsum.photos/1280/720",
        title: podcastTitle,
        description: `An AI-generated video for the podcast: ${podcastTitle}`,
        tags: ["ai", "podcast", "generated", "audio"],
        duration: 300 // 5 minutes
      };

      setGeneratedVideo(mockVideo);
      onVideoGenerated?.(mockVideo);
      toast.success("Video generated successfully!");

    } catch (error) {
      toast.error("Failed to generate video");
    } finally {
      setIsGenerating(false);
      setCurrentStep("");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="huly-glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 huly-gradient-text">
            <Video className="h-5 w-5" />
            AI Video Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="settings" className="space-y-4">
            <TabsList className="huly-glass border-white/20">
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="preview" disabled={!generatedVideo}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Video Style</Label>
                  <Select 
                    value={settings.style} 
                    onValueChange={(value: any) => setSettings({...settings, style: value})}
                  >
                    <SelectTrigger className="huly-glass border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {videoStyles.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          <div>
                            <div className="font-medium">{style.name}</div>
                            <div className="text-xs text-muted-foreground">{style.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Background Type</Label>
                  <Select 
                    value={settings.backgroundType} 
                    onValueChange={(value: any) => setSettings({...settings, backgroundType: value})}
                  >
                    <SelectTrigger className="huly-glass border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai-generated">AI Generated</SelectItem>
                      <SelectItem value="image">Upload Image</SelectItem>
                      <SelectItem value="video">Upload Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Resolution</Label>
                  <Select 
                    value={settings.resolution} 
                    onValueChange={(value: any) => setSettings({...settings, resolution: value})}
                  >
                    <SelectTrigger className="huly-glass border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p HD</SelectItem>
                      <SelectItem value="1080p">1080p Full HD</SelectItem>
                      <SelectItem value="4K">4K Ultra HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Aspect Ratio</Label>
                  <Select 
                    value={settings.aspectRatio} 
                    onValueChange={(value: any) => setSettings({...settings, aspectRatio: value})}
                  >
                    <SelectTrigger className="huly-glass border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9 (YouTube)</SelectItem>
                      <SelectItem value="9:16">9:16 (TikTok/Shorts)</SelectItem>
                      <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {settings.backgroundType === 'ai-generated' && (
                <div className="space-y-2">
                  <Label>Background Description</Label>
                  <Textarea
                    placeholder="Describe the background you want (e.g., 'Abstract technology background with blue particles')"
                    value={settings.backgroundPrompt}
                    onChange={(e) => setSettings({...settings, backgroundPrompt: e.target.value})}
                    className="huly-glass border-white/20"
                  />
                </div>
              )}

              <Button 
                onClick={generateVideo}
                disabled={isGenerating || !podcastAudioUrl}
                className="w-full huly-gradient text-white border-0"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Video
                  </>
                )}
              </Button>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{currentStep}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              {generatedVideo && (
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video 
                      controls 
                      className="w-full h-full"
                      poster={generatedVideo.thumbnailUrl}
                    >
                      <source src={generatedVideo.videoUrl} type="video/mp4" />
                    </video>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Video Details</h3>
                      <div className="text-sm space-y-1">
                        <p><strong>Title:</strong> {generatedVideo.title}</p>
                        <p><strong>Duration:</strong> {Math.floor(generatedVideo.duration / 60)}:{(generatedVideo.duration % 60).toString().padStart(2, '0')}</p>
                        <p><strong>Resolution:</strong> {settings.resolution}</p>
                        <p><strong>Aspect Ratio:</strong> {settings.aspectRatio}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold">Tags</h3>
                      <div className="flex flex-wrap gap-1">
                        {generatedVideo.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoGenerator;

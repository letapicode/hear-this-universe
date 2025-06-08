
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Mic, Play, Download, Sparkles, Video, Youtube, Library } from "lucide-react";
import { toast } from "sonner";
import VideoGenerator from "./VideoGenerator";
import YouTubeUploader from "./YouTubeUploader";
import DownloadManager from "./DownloadManager";
import ContentLibrary from "./content-library/ContentLibrary";

interface PodcastSettings {
  topic: string;
  duration: string;
  tone: string;
  voices: string[];
  format: string;
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

interface GeneratedContent {
  id: string;
  type: 'podcast' | 'video';
  title: string;
  description: string;
  audioUrl?: string;
  videoUrl?: string;
  thumbnailUrl: string;
  duration: number;
  createdAt: string;
  tags: string[];
  youtubeUrl?: string;
}

const AIPodcastGenerator = () => {
  const [settings, setSettings] = useState<PodcastSettings>({
    topic: "",
    duration: "5",
    tone: "conversational",
    voices: ["alloy"],
    format: "interview"
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [activeTab, setActiveTab] = useState("script");
  const [savedContents, setSavedContents] = useState<GeneratedContent[]>([]);

  const handleGenerate = async () => {
    if (!settings.topic.trim()) {
      toast.error("Please enter a topic for your podcast");
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockScript = `Welcome to AI Generated Podcast about "${settings.topic}".

HOST 1: Hello everyone, and welcome to today's episode where we'll be exploring ${settings.topic}.

HOST 2: That's right! This is such an fascinating topic. Let me start by asking - what makes ${settings.topic} so important in today's world?

HOST 1: Great question! ${settings.topic} has been gaining significant attention because of its transformative potential across multiple industries. From healthcare to education, we're seeing unprecedented applications that are reshaping how we approach traditional problems.

HOST 2: Absolutely. I think what's particularly interesting is how accessible this technology has become. Just a few years ago, what we're discussing today would have seemed like science fiction.

HOST 1: Exactly! And that accessibility is driving innovation at an incredible pace. We're seeing startups and established companies alike finding new ways to leverage these capabilities.

HOST 2: Speaking of innovation, what do you think are some of the most promising developments we should be watching?

HOST 1: I'd say the integration with existing workflows is key. It's not just about having powerful technology - it's about making it seamlessly fit into how people already work and think.

HOST 2: That's such an important point. The best technology is often the kind you don't even notice you're using.

HOST 1: Before we wrap up, what would you say is the key takeaway for our listeners about ${settings.topic}?

HOST 2: I'd say the most important thing to remember is that we're still in the early stages. The potential is enormous, but we need to approach it thoughtfully and ethically.

HOST 1: Excellent point! Thank you all for listening, and we'll see you in the next episode where we'll dive even deeper into these topics!`;

      setGeneratedScript(mockScript);
      
      setTimeout(() => {
        const mockAudioUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav";
        setAudioUrl(mockAudioUrl);
        
        // Save the generated content
        const newContent: GeneratedContent = {
          id: Date.now().toString(),
          type: 'podcast',
          title: `Podcast: ${settings.topic}`,
          description: `An AI-generated podcast about ${settings.topic}`,
          audioUrl: mockAudioUrl,
          thumbnailUrl: "https://picsum.photos/1280/720",
          duration: parseInt(settings.duration) * 60,
          createdAt: new Date().toISOString(),
          tags: ['podcast', 'ai-generated', settings.topic.toLowerCase()]
        };
        
        setSavedContents(prev => [newContent, ...prev]);
        toast.success("Podcast generated and saved successfully!");
        setActiveTab("video");
      }, 2000);

    } catch (error) {
      toast.error("Failed to generate podcast");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVideoGenerated = (video: GeneratedVideo) => {
    setGeneratedVideo(video);
    
    // Update the saved content with video info
    setSavedContents(prev => prev.map(content => {
      if (content.type === 'podcast' && content.title === `Podcast: ${settings.topic}`) {
        return {
          ...content,
          type: 'video' as const,
          videoUrl: video.videoUrl,
          thumbnailUrl: video.thumbnailUrl
        };
      }
      return content;
    }));
    
    setActiveTab("download");
  };

  const handleYouTubeUpload = (youtubeUrl: string) => {
    setSavedContents(prev => prev.map(content => {
      if (content.videoUrl === generatedVideo?.videoUrl) {
        return { ...content, youtubeUrl };
      }
      return content;
    }));
  };

  const handleDeleteContent = (id: string) => {
    setSavedContents(prev => prev.filter(content => content.id !== id));
  };

  const handlePlayContent = (content: GeneratedContent) => {
    // Implement play functionality
    if (content.audioUrl) {
      window.open(content.audioUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="huly-glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 huly-gradient-text">
            <Sparkles className="h-5 w-5" />
            AI Podcast Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Podcast Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., The Future of AI in Healthcare"
                value={settings.topic}
                onChange={(e) => setSettings({...settings, topic: e.target.value})}
                className="huly-glass border-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={settings.duration} onValueChange={(value) => setSettings({...settings, duration: value})}>
                <SelectTrigger className="huly-glass border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={settings.tone} onValueChange={(value) => setSettings({...settings, tone: value})}>
                <SelectTrigger className="huly-glass border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select value={settings.format} onValueChange={(value) => setSettings({...settings, format: value})}>
                <SelectTrigger className="huly-glass border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interview">Interview Style</SelectItem>
                  <SelectItem value="monologue">Solo Monologue</SelectItem>
                  <SelectItem value="discussion">Panel Discussion</SelectItem>
                  <SelectItem value="storytelling">Storytelling</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !settings.topic.trim()}
            className="w-full huly-gradient text-white border-0 hover:opacity-90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Podcast...
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Generate AI Podcast
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedScript && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="huly-glass border-white/20 w-full">
            <TabsTrigger value="script" className="flex-1">Script & Audio</TabsTrigger>
            <TabsTrigger value="video" disabled={!audioUrl} className="flex-1">
              <Video className="h-4 w-4 mr-2" />
              Generate Video
            </TabsTrigger>
            <TabsTrigger value="youtube" disabled={!generatedVideo} className="flex-1">
              <Youtube className="h-4 w-4 mr-2" />
              YouTube Upload
            </TabsTrigger>
            <TabsTrigger value="download" disabled={!audioUrl} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Downloads
            </TabsTrigger>
            <TabsTrigger value="library" className="flex-1">
              <Library className="h-4 w-4 mr-2" />
              My Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="script" className="space-y-4">
            <Card className="huly-glass border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Generated Script</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedScript}
                  onChange={(e) => setGeneratedScript(e.target.value)}
                  className="min-h-[300px] huly-glass border-white/20"
                  placeholder="Generated script will appear here..."
                />
                
                {audioUrl && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        Audio Ready
                      </Badge>
                    </div>
                    
                    <audio controls className="w-full">
                      <source src={audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="border-white/20 hover:bg-white/10 hover:text-white"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        onClick={() => setActiveTab("video")}
                        className="huly-gradient text-white border-0 hover:opacity-90"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Create Video
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="video" className="space-y-4">
            <VideoGenerator
              podcastScript={generatedScript}
              podcastAudioUrl={audioUrl}
              podcastTitle={`Podcast: ${settings.topic}`}
              onVideoGenerated={handleVideoGenerated}
            />
          </TabsContent>

          <TabsContent value="youtube" className="space-y-4">
            {generatedVideo && (
              <YouTubeUploader
                video={generatedVideo}
                podcastScript={generatedScript}
                onUploadSuccess={handleYouTubeUpload}
              />
            )}
          </TabsContent>

          <TabsContent value="download" className="space-y-4">
            {audioUrl && (
              <DownloadManager
                video={generatedVideo || {
                  id: '1',
                  videoUrl: '',
                  thumbnailUrl: 'https://picsum.photos/1280/720',
                  title: `Podcast: ${settings.topic}`,
                  description: 'AI Generated Podcast',
                  tags: ['podcast', 'ai'],
                  duration: parseInt(settings.duration) * 60
                }}
                audioUrl={audioUrl}
              />
            )}
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            <ContentLibrary
              contents={savedContents}
              onDelete={handleDeleteContent}
              onPlay={handlePlayContent}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AIPodcastGenerator;

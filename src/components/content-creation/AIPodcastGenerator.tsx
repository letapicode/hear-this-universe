
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mic, Play, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface PodcastSettings {
  topic: string;
  duration: string;
  tone: string;
  voices: string[];
  format: string;
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

  const handleGenerate = async () => {
    if (!settings.topic.trim()) {
      toast.error("Please enter a topic for your podcast");
      return;
    }

    setIsGenerating(true);
    try {
      // Mock AI generation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockScript = `Welcome to AI Generated Podcast about "${settings.topic}".

HOST 1: Hello everyone, and welcome to today's episode where we'll be exploring ${settings.topic}.

HOST 2: That's right! This is such an fascinating topic. Let me start by asking - what makes ${settings.topic} so important in today's world?

HOST 1: Great question! ${settings.topic} has been gaining significant attention because...

[The conversation continues with engaging dialogue about the topic, incorporating expert insights and real-world examples]

HOST 2: Before we wrap up, what would you say is the key takeaway for our listeners?

HOST 1: I'd say the most important thing to remember about ${settings.topic} is...

HOST 2: Excellent point! Thank you all for listening, and we'll see you in the next episode!`;

      setGeneratedScript(mockScript);
      
      // Mock audio generation
      setTimeout(() => {
        setAudioUrl("https://www.soundjay.com/misc/sounds/bell-ringing-05.wav");
        toast.success("Podcast generated successfully!");
      }, 2000);

    } catch (error) {
      toast.error("Failed to generate podcast");
    } finally {
      setIsGenerating(false);
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
            className="w-full huly-gradient text-white border-0"
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
                  <Button variant="outline" className="border-white/20">
                    <Play className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" className="border-white/20">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIPodcastGenerator;

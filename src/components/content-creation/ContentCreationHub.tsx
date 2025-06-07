
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AIPodcastGenerator from "./AIPodcastGenerator";
import VoiceJournal from "./VoiceJournal";
import AudioRemixStudio from "./AudioRemixStudio";
import { Mic, FileAudio, Sparkles, Zap } from "lucide-react";

const ContentCreationHub = () => {
  const [activeTab, setActiveTab] = useState("podcast");

  const tools = [
    {
      id: "podcast",
      name: "AI Podcast Generator",
      icon: Sparkles,
      description: "Create professional podcasts with AI-generated scripts and voices",
      badge: "New"
    },
    {
      id: "journal",
      name: "Voice Journal",
      icon: Mic,
      description: "Record voice entries and get AI transcriptions",
      badge: "Popular"
    },
    {
      id: "remix",
      name: "Audio Remix Studio",
      icon: FileAudio,
      description: "Advanced audio editing with AI-powered effects",
      badge: "Pro"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold huly-gradient-text mb-4">
          Content Creation Studio
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Professional audio content creation tools powered by AI. Generate podcasts, record voice journals, and remix audio with advanced AI effects.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Card 
              key={tool.id}
              className={`huly-glass border-white/10 cursor-pointer transition-all hover:border-white/20 ${
                activeTab === tool.id ? "ring-2 ring-primary/50" : ""
              }`}
              onClick={() => setActiveTab(tool.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <IconComponent className="h-8 w-8 huly-gradient-text" />
                  <Badge variant="secondary" className="text-xs">
                    {tool.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="huly-glass border-white/20 p-1 mb-8 w-full">
          <TabsTrigger 
            value="podcast" 
            className="data-[state=active]:huly-gradient data-[state=active]:text-white data-[state=active]:border-0 px-6 py-3 text-base font-medium flex items-center gap-2 flex-1"
          >
            <Sparkles className="h-4 w-4" />
            AI Podcast Generator
          </TabsTrigger>
          <TabsTrigger 
            value="journal" 
            className="data-[state=active]:huly-gradient data-[state=active]:text-white data-[state=active]:border-0 px-6 py-3 text-base font-medium flex items-center gap-2 flex-1"
          >
            <Mic className="h-4 w-4" />
            Voice Journal
          </TabsTrigger>
          <TabsTrigger 
            value="remix" 
            className="data-[state=active]:huly-gradient data-[state=active]:text-white data-[state=active]:border-0 px-6 py-3 text-base font-medium flex items-center gap-2 flex-1"
          >
            <FileAudio className="h-4 w-4" />
            Audio Remix Studio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="podcast" className="space-y-6">
          <AIPodcastGenerator />
        </TabsContent>

        <TabsContent value="journal" className="space-y-6">
          <VoiceJournal />
        </TabsContent>

        <TabsContent value="remix" className="space-y-6">
          <AudioRemixStudio />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentCreationHub;

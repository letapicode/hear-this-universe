import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrendingSection from "@/components/TrendingSection";
import LuxuryParticles from "@/components/LuxuryParticles";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";
import SearchAndFiltersSection from "@/components/sections/SearchAndFiltersSection";
import StatsSection from "@/components/sections/StatsSection";
import LibrarySection from "@/components/sections/LibrarySection";
import PlayerManager from "@/components/PlayerManager";
import MoodDiscovery from "@/components/MoodDiscovery";
import UserPreferences from "@/components/UserPreferences";
import AIInsightsDashboard from "@/components/AIInsightsDashboard";
import AIChatAssistant from "@/components/AIChatAssistant";
import SmartBookmarks from "@/components/SmartBookmarks";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories, useSeries } from "@/hooks/useContentData";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useListeningHistory } from "@/hooks/useListeningHistory";
import { useContentFiltering } from "@/hooks/useContentFiltering";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Brain, Home, Settings, BarChart3, Sparkles } from "lucide-react";

interface SearchFilters {
  categories: string[];
  isPremium?: boolean;
  rating?: number;
  duration?: 'short' | 'medium' | 'long';
}

const Index = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showChapters, setShowChapters] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    isPremium: undefined,
    rating: undefined,
    duration: undefined
  });
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatMinimized, setAIChatMinimized] = useState(true);

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: series = [], isLoading: seriesLoading } = useSeries();
  
  const audioPlayer = useAudioPlayer();
  const listeningHistory = useListeningHistory();

  const { filteredContent, featuredContent, trendingContent } = useContentFiltering(
    series,
    searchQuery,
    selectedCategory,
    filters
  );

  useKeyboardShortcuts({
    onPlayPause: audioPlayer.togglePlayPause,
    onSkipForward: () => audioPlayer.skipForward(15),
    onSkipBackward: () => audioPlayer.skipBackward(15),
    onVolumeUp: () => audioPlayer.setVolume(Math.min(audioPlayer.volume + 10, 100)),
    onVolumeDown: () => audioPlayer.setVolume(Math.max(audioPlayer.volume - 10, 0)),
    onSeekForward: () => audioPlayer.skipForward(5),
    onSeekBackward: () => audioPlayer.skipBackward(5),
    isPlayerActive: !!audioPlayer.currentContent
  });

  useEffect(() => {
    if (audioPlayer.currentContent && audioPlayer.isPlaying) {
      listeningHistory.startSession(audioPlayer.currentContent);
    } else if (!audioPlayer.isPlaying && listeningHistory.currentSession) {
      listeningHistory.updateSession(audioPlayer.currentTime);
    }
  }, [audioPlayer.currentContent, audioPlayer.isPlaying]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || categoriesLoading || seriesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <LuxuryParticles />
        <div className="glass-morphism p-12 rounded-3xl text-center animate-pulse">
          <div className="luxury-gradient w-16 h-16 rounded-full mx-auto mb-6 animate-glow"></div>
          <div className="text-2xl font-medium luxury-gradient-text">Loading your experience...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const categoryNames = ["All", ...categories.map(cat => cat.name)];

  const handlePlay = (content) => {
    audioPlayer.playContent(content);
    setIsMinimized(false);
  };

  const handleSignOut = async () => {
    if (listeningHistory.currentSession) {
      listeningHistory.endSession();
    }
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <LuxuryParticles />
      
      <Header 
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSignOut={handleSignOut}
      />

      <div className="container mx-auto px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="huly-glass border-white/20 p-1 mb-8">
            <TabsTrigger 
              value="home" 
              className="data-[state=active]:huly-gradient data-[state=active]:text-white data-[state=active]:border-0 px-6 py-3 text-base font-medium flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger 
              value="ai-discovery" 
              className="data-[state=active]:huly-gradient data-[state=active]:text-white data-[state=active]:border-0 px-6 py-3 text-base font-medium flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              AI Discovery
            </TabsTrigger>
            <TabsTrigger 
              value="content-creation" 
              className="data-[state=active]:huly-gradient data-[state=active]:text-white data-[state=active]:border-0 px-6 py-3 text-base font-medium flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Create Content
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="data-[state=active]:huly-gradient data-[state=active]:text-white data-[state=active]:border-0 px-6 py-3 text-base font-medium flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger 
              value="preferences" 
              className="data-[state=active]:huly-gradient data-[state=active]:text-white data-[state=active]:border-0 px-6 py-3 text-base font-medium flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-12">
            <HeroSection 
              user={user}
              featuredContent={featuredContent}
              onPlay={handlePlay}
            />

            <StatsSection onPlay={handlePlay} />

            <SearchAndFiltersSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filters={filters}
              onFiltersChange={setFilters}
              availableCategories={categoryNames}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <LibrarySection
              filteredContent={filteredContent}
              onPlay={handlePlay}
              currentlyPlaying={audioPlayer.currentContent}
            />

            <TrendingSection 
              trendingContent={trendingContent}
              onPlay={handlePlay}
              currentlyPlaying={audioPlayer.currentContent}
            />

            {/* Smart Bookmarks Section */}
            {audioPlayer.currentContent && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SmartBookmarks
                  currentContent={audioPlayer.currentContent}
                  currentTime={audioPlayer.currentTime}
                  onSeekTo={audioPlayer.seekTo}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai-discovery" className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold huly-gradient-text mb-4">
                AI-Powered Discovery
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Let our AI understand your mood and preferences to find perfect content for any moment
              </p>
            </div>
            <MoodDiscovery onContentSelect={handlePlay} />
          </TabsContent>

          <TabsContent value="content-creation" className="space-y-8">
            <ContentCreationHub />
          </TabsContent>

          <TabsContent value="insights" className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold huly-gradient-text mb-4">
                AI Insights Dashboard
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover patterns in your listening habits and AI recommendation performance
              </p>
            </div>
            <AIInsightsDashboard />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold huly-gradient-text mb-4">
                AI Preferences
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Customize how our AI learns from your behavior and generates recommendations
              </p>
            </div>
            <UserPreferences />
          </TabsContent>
        </Tabs>
      </div>

      <KeyboardShortcutsHelp />

      <PlayerManager
        currentContent={audioPlayer.currentContent}
        isPlaying={audioPlayer.isPlaying}
        currentTime={audioPlayer.currentTime}
        duration={audioPlayer.duration}
        isMinimized={isMinimized}
        showChapters={showChapters}
        audioPlayer={audioPlayer}
        listeningHistory={listeningHistory}
        onMinimize={setIsMinimized}
      />

      {/* AI Chat Assistant */}
      {audioPlayer.currentContent && (
        <AIChatAssistant
          currentContent={audioPlayer.currentContent}
          currentTime={audioPlayer.currentTime}
          isMinimized={aiChatMinimized}
          onToggleMinimize={() => setAIChatMinimized(!aiChatMinimized)}
        />
      )}

      {/* Toggle AI Chat Button */}
      {audioPlayer.currentContent && aiChatMinimized && (
        <Button
          onClick={() => setAIChatMinimized(false)}
          className="fixed bottom-4 left-4 huly-gradient text-white border-0 rounded-full w-12 h-12 p-0 z-50"
        >
          <Brain className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default Index;

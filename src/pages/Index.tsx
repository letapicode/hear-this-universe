
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "@/components/AudioPlayer";
import CategoryFilter from "@/components/CategoryFilter";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrendingSection from "@/components/TrendingSection";
import LuxuryParticles from "@/components/LuxuryParticles";
import EnhancedContentCard from "@/components/EnhancedContentCard";
import EnhancedSearch from "@/components/EnhancedSearch";
import ChapterNavigation from "@/components/ChapterNavigation";
import MiniPlayer from "@/components/MiniPlayer";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories, useSeries } from "@/hooks/useContentData";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useListeningHistory } from "@/hooks/useListeningHistory";

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
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    isPremium: undefined,
    rating: undefined,
    duration: undefined
  });

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: series = [], isLoading: seriesLoading } = useSeries();
  
  // Enhanced audio player with state management
  const audioPlayer = useAudioPlayer();
  const listeningHistory = useListeningHistory();

  // Keyboard shortcuts
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

  // Update listening history when content changes
  useEffect(() => {
    if (audioPlayer.currentContent && audioPlayer.isPlaying) {
      listeningHistory.startSession(audioPlayer.currentContent);
    } else if (!audioPlayer.isPlaying && listeningHistory.currentSession) {
      listeningHistory.updateSession(audioPlayer.currentTime);
    }
  }, [audioPlayer.currentContent, audioPlayer.isPlaying]);

  // Redirect to auth if not logged in
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

  // Transform series data
  const transformedSeries = series.map(s => ({
    id: s.id,
    title: s.title,
    author: s.author,
    category: s.categories?.name || 'Unknown',
    episodes: s.total_episodes,
    duration: "45 min avg",
    image: s.cover_image_url || "/placeholder.svg",
    description: s.description,
    isNew: new Date(s.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isPremium: s.is_premium
  }));

  // Enhanced filtering logic
  const filteredContent = transformedSeries.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || content.category === selectedCategory;
    
    const matchesFilters = filters.categories.length === 0 || filters.categories.includes(content.category);
    const matchesPremium = filters.isPremium === undefined || content.isPremium === filters.isPremium;
    
    return matchesSearch && matchesCategory && matchesFilters && matchesPremium;
  });

  const featuredContent = transformedSeries.filter(s => series.find(original => original.id === s.id)?.is_featured);
  const trendingContent = transformedSeries.slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <LuxuryParticles />
      
      <Header 
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSignOut={handleSignOut}
      />

      <HeroSection 
        user={user}
        featuredContent={featuredContent}
        onPlay={handlePlay}
      />

      {/* Enhanced Search Section */}
      <section className="container mx-auto px-8 mb-12">
        <EnhancedSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
          availableCategories={categoryNames}
        />
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-8 mb-20">
        <CategoryFilter 
          categories={categoryNames}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </section>

      {/* Content Library with Enhanced Cards */}
      <section className="container mx-auto px-8 mb-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold luxury-gradient-text">
            Your Library
          </h2>
          <div className="text-gray-400">
            {filteredContent.length} audiobook{filteredContent.length !== 1 ? 's' : ''}
          </div>
        </div>

        {filteredContent.length === 0 ? (
          <div className="text-center py-20">
            <div className="luxury-gradient w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
              <div className="w-10 h-10 bg-white/20 rounded-full"></div>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">No audiobooks found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Try adjusting your search terms or filters to find more content.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredContent.map((content) => (
              <EnhancedContentCard
                key={content.id}
                content={content}
                onPlay={handlePlay}
                currentlyPlaying={audioPlayer.currentContent}
              />
            ))}
          </div>
        )}
      </section>

      <TrendingSection 
        trendingContent={trendingContent}
        onPlay={handlePlay}
        currentlyPlaying={audioPlayer.currentContent}
      />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp />

      {/* Audio Player - Full or Mini */}
      {audioPlayer.currentContent && (
        <>
          {isMinimized ? (
            <MiniPlayer
              content={audioPlayer.currentContent}
              isPlaying={audioPlayer.isPlaying}
              currentTime={audioPlayer.currentTime}
              duration={audioPlayer.duration}
              onPlayPause={audioPlayer.togglePlayPause}
              onSkipForward={() => audioPlayer.skipForward(15)}
              onSkipBackward={() => audioPlayer.skipBackward(15)}
              onMaximize={() => setIsMinimized(false)}
            />
          ) : (
            <div className="fixed bottom-0 left-0 right-0 z-50">
              <div className="flex">
                <div className="flex-1">
                  <AudioPlayer 
                    content={audioPlayer.currentContent}
                    isPlaying={audioPlayer.isPlaying}
                    onPlayPause={audioPlayer.togglePlayPause}
                    onClose={() => {
                      audioPlayer.closePlayer();
                      if (listeningHistory.currentSession) {
                        listeningHistory.endSession();
                      }
                    }}
                  />
                </div>
                
                {showChapters && (
                  <div className="w-80 bg-black/95 backdrop-blur-xl border-l border-white/10">
                    <ChapterNavigation
                      episodeId={audioPlayer.currentContent.id}
                      currentTime={audioPlayer.currentTime}
                      onSeek={audioPlayer.seekTo}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Index;

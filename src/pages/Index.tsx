
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
import { useAuth } from "@/contexts/AuthContext";
import { useCategories, useSeries } from "@/hooks/useContentData";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useListeningHistory } from "@/hooks/useListeningHistory";
import { useContentFiltering } from "@/hooks/useContentFiltering";

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
    </div>
  );
};

export default Index;

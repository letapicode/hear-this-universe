
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
import { useAuth } from "@/contexts/AuthContext";
import { useCategories, useSeries } from "@/hooks/useContentData";
import { useSeriesReviews } from "@/hooks/useReviews";

interface SearchFilters {
  categories: string[];
  isPremium?: boolean;
  rating?: number;
  duration?: 'short' | 'medium' | 'long';
}

const Index = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showChapters, setShowChapters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    isPremium: undefined,
    rating: undefined,
    duration: undefined
  });

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: series = [], isLoading: seriesLoading } = useSeries();

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
    setCurrentlyPlaying(content);
    setIsPlaying(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  // Transform series data and add review ratings
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
    // Text search
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === "All" || content.category === selectedCategory;
    
    // Advanced filters
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
                currentlyPlaying={currentlyPlaying}
              />
            ))}
          </div>
        )}
      </section>

      <TrendingSection 
        trendingContent={trendingContent}
        onPlay={handlePlay}
        currentlyPlaying={currentlyPlaying}
      />

      {/* Enhanced Audio Player */}
      {currentlyPlaying && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="flex">
            <div className="flex-1">
              <AudioPlayer 
                content={currentlyPlaying}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onClose={() => setCurrentlyPlaying(null)}
              />
            </div>
            
            {showChapters && (
              <div className="w-80 bg-black/95 backdrop-blur-xl border-l border-white/10">
                <ChapterNavigation
                  episodeId={currentlyPlaying.id.toString()}
                  currentTime={0} // This would come from the audio player state
                  onSeek={(time) => {
                    // This would seek to the specific time in the audio player
                    console.log('Seeking to', time);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;

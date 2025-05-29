
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "@/components/AudioPlayer";
import CategoryFilter from "@/components/CategoryFilter";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContentLibrary from "@/components/ContentLibrary";
import TrendingSection from "@/components/TrendingSection";
import LuxuryParticles from "@/components/LuxuryParticles";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories, useSeries } from "@/hooks/useContentData";

const Index = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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
    return null; // Will redirect to auth
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

  // Transform series data to match expected format
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

  const filteredContent = transformedSeries.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || content.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

      {/* Category Filter */}
      <section className="container mx-auto px-8 mb-20">
        <CategoryFilter 
          categories={categoryNames}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </section>

      <ContentLibrary 
        filteredContent={filteredContent}
        onPlay={handlePlay}
        currentlyPlaying={currentlyPlaying}
      />

      <TrendingSection 
        trendingContent={trendingContent}
        onPlay={handlePlay}
        currentlyPlaying={currentlyPlaying}
      />

      {/* Audio Player */}
      {currentlyPlaying && (
        <AudioPlayer 
          content={currentlyPlaying}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onClose={() => setCurrentlyPlaying(null)}
        />
      )}
    </div>
  );
};

export default Index;

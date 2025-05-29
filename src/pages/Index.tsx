
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Search, Headphones, BookOpen, User, LogOut, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AudioPlayer from "@/components/AudioPlayer";
import ContentCard from "@/components/ContentCard";
import CategoryFilter from "@/components/CategoryFilter";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories, useSeries } from "@/hooks/useContentData";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl font-medium">Loading...</div>
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2.5 rounded-xl">
                <Headphones className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                AudioVerse
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search stories, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-border hover:bg-accent">
                    <User className="h-4 w-4 mr-2" />
                    {user.user_metadata?.full_name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-popover border-border shadow-lg">
                  <DropdownMenuItem onClick={handleSignOut} className="hover:bg-accent">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                Get Pro
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold mb-6 text-foreground leading-tight">
            Welcome back, <span className="text-primary">{user.user_metadata?.full_name || 'Listener'}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Continue your audio journey with thousands of captivating stories and podcasts
          </p>
        </div>

        {/* Featured Story Highlight */}
        {featuredContent.length > 0 && (
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mb-16 animate-slide-up">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-semibold flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Featured
                    </span>
                    {featuredContent[0].isNew && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">NEW</span>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold mb-2 text-foreground">{featuredContent[0].title}</h3>
                  <p className="text-primary mb-4 font-medium">by {featuredContent[0].author}</p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{featuredContent[0].description}</p>
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>{featuredContent[0].episodes} episodes</span>
                    </span>
                    <span className="text-sm text-muted-foreground">{featuredContent[0].duration}</span>
                  </div>
                  <Button 
                    onClick={() => handlePlay(featuredContent[0])}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3 font-medium"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Listening
                  </Button>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                    <BookOpen className="h-24 w-24 text-primary/60" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-6 mb-12">
        <CategoryFilter 
          categories={categoryNames}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </section>

      {/* Content Library */}
      <section className="container mx-auto px-6 mb-16">
        <h3 className="text-2xl font-bold mb-8 text-foreground">Discover Stories</h3>
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
            {filteredContent.map((content) => (
              <ContentCard 
                key={content.id}
                content={content}
                onPlay={handlePlay}
                isCurrentlyPlaying={currentlyPlaying?.id === content.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-16">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No content found. Try adjusting your search or filters.</p>
          </div>
        )}
      </section>

      {/* Trending Section */}
      {trendingContent.length > 0 && (
        <section className="container mx-auto px-6 mb-16">
          <div className="flex items-center space-x-2 mb-8">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">Trending Now</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingContent.map((content) => (
              <ContentCard 
                key={content.id}
                content={content}
                onPlay={handlePlay}
                isCurrentlyPlaying={currentlyPlaying?.id === content.id}
                compact
              />
            ))}
          </div>
        </section>
      )}

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

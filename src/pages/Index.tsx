
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Pause, SkipForward, SkipBack, Search, Headphones, BookOpen, User, LogOut } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
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
    duration: "45 min avg", // You can calculate this from episodes
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
  const trendingContent = transformedSeries.slice(0, 2); // Simple trending logic

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Headphones className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AudioVerse
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search stories, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/20"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <User className="h-4 w-4 mr-2" />
                    {user.user_metadata?.full_name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900 border-gray-700">
                  <DropdownMenuItem onClick={handleSignOut} className="text-white hover:bg-gray-800">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Get Premium
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            Welcome back, {user.user_metadata?.full_name || 'Listener'}!
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Continue your audio journey with thousands of captivating stories and podcasts.
          </p>
        </div>

        {/* Featured Story Highlight */}
        {featuredContent.length > 0 && (
          <Card className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 border-purple-500/30 mb-12">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                    {featuredContent[0].isNew && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">NEW</span>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{featuredContent[0].title}</h3>
                  <p className="text-purple-300 mb-4">by {featuredContent[0].author}</p>
                  <p className="text-gray-300 mb-6">{featuredContent[0].description}</p>
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="flex items-center space-x-1 text-sm text-gray-400">
                      <BookOpen className="h-4 w-4" />
                      <span>{featuredContent[0].episodes} episodes</span>
                    </span>
                    <span className="text-sm text-gray-400">{featuredContent[0].duration}</span>
                  </div>
                  <Button 
                    onClick={() => handlePlay(featuredContent[0])}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-3"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Listening
                  </Button>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-24 w-24 text-white/80" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-4 mb-8">
        <CategoryFilter 
          categories={categoryNames}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </section>

      {/* Content Library */}
      <section className="container mx-auto px-4 mb-12">
        <h3 className="text-2xl font-bold mb-6">Discover Stories</h3>
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="text-center text-gray-400 py-12">
            No content found. Try adjusting your search or filters.
          </div>
        )}
      </section>

      {/* Trending Section */}
      {trendingContent.length > 0 && (
        <section className="container mx-auto px-4 mb-12">
          <h3 className="text-2xl font-bold mb-6">Trending Now</h3>
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

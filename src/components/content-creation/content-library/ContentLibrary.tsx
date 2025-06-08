
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Library, 
  Search, 
  Filter, 
  Play, 
  Download, 
  Trash2, 
  ExternalLink,
  Video,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useVideoStorage, SavedVideo } from "@/hooks/useVideoStorage";

const ContentLibrary = () => {
  const [videos, setVideos] = useState<SavedVideo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { getUserVideos, deleteVideo } = useVideoStorage();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const result = await getUserVideos();
      setVideos(result.videos || []);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || video.video_type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDeleteVideo = async (videoId: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo(videoId);
        setVideos(videos.filter(v => v.id !== videoId));
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  const handleDownload = (video: SavedVideo) => {
    if (video.video_url) {
      const link = document.createElement('a');
      link.href = video.video_url;
      link.download = `${video.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started!');
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'Unknown';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Card className="huly-glass border-white/10">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="huly-glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 huly-gradient-text">
          <Library className="h-5 w-5" />
          Content Library
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 huly-glass border-white/20"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48 huly-glass border-white/20">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="podcast">Podcasts</SelectItem>
              <SelectItem value="remix">Remixes</SelectItem>
              <SelectItem value="journal">Voice Journals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchTerm || filterType !== "all" 
                ? "No content matches your search criteria" 
                : "No content generated yet. Create your first video!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="huly-glass border-white/10 group hover:border-white/20 transition-colors">
                <div className="aspect-video bg-black rounded-t-lg overflow-hidden relative">
                  {video.thumbnail_url ? (
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                      <Video className="h-12 w-12 text-white/50" />
                    </div>
                  )}
                  
                  {video.video_url && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 hover:bg-white/10 hover:text-white"
                        onClick={() => window.open(video.video_url!, '_blank')}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {video.video_type}
                    </Badge>
                  </div>
                  
                  <div className="absolute bottom-2 right-2 bg-black/70 rounded px-2 py-1 text-xs text-white">
                    {formatDuration(video.duration_seconds)}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold truncate" title={video.title}>
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </div>
                    
                    {video.tags && video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {video.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {video.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{video.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex gap-2">
                        {video.video_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(video)}
                            className="border-white/20 hover:bg-white/10 hover:text-white"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {video.video_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(video.video_url!, '_blank')}
                            className="border-white/20 hover:bg-white/10 hover:text-white"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteVideo(video.id)}
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentLibrary;

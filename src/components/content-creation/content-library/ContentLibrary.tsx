
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Library, 
  Search, 
  Play, 
  Download, 
  Trash2, 
  Youtube,
  Calendar,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface GeneratedContent {
  id: string;
  type: 'podcast' | 'video';
  title: string;
  description: string;
  audioUrl?: string;
  videoUrl?: string;
  thumbnailUrl: string;
  duration: number;
  createdAt: string;
  tags: string[];
  youtubeUrl?: string;
}

interface ContentLibraryProps {
  contents: GeneratedContent[];
  onDelete: (id: string) => void;
  onPlay: (content: GeneratedContent) => void;
}

const ContentLibrary = ({ contents, onDelete, onPlay }: ContentLibraryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'podcast' | 'video'>('all');

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || content.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(id);
      toast.success("Content deleted successfully");
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 huly-glass border-white/20"
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'podcast', 'video'].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type as any)}
                className={filterType === type 
                  ? "huly-gradient text-white border-0" 
                  : "border-white/20 hover:bg-white/10 hover:text-white"
                }
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-4">
          {filteredContents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No content matches your search" : "No content generated yet"}
            </div>
          ) : (
            filteredContents.map((content) => (
              <div key={content.id} className="huly-glass border border-white/10 rounded-lg p-4">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={content.thumbnailUrl} 
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold truncate">{content.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {content.description}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(content.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(content.duration)}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {content.type}
                          </Badge>
                          {content.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-white/20">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onPlay(content)}
                          className="h-8 w-8 p-0 hover:bg-white/10"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(content.videoUrl || content.audioUrl, '_blank')}
                          className="h-8 w-8 p-0 hover:bg-white/10"
                        >
                          <Download className="h-4 w-4" />
                        </Button>

                        {content.youtubeUrl && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(content.youtubeUrl, '_blank')}
                            className="h-8 w-8 p-0 hover:bg-white/10"
                          >
                            <Youtube className="h-4 w-4" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(content.id, content.title)}
                          className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentLibrary;

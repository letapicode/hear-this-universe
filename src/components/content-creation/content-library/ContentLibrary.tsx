
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Library, Search, Play, Trash2, Download, Youtube, Calendar } from "lucide-react";
import { format } from "date-fns";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || content.type === filterType;
    return matchesSearch && matchesType;
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="huly-glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 huly-gradient-text">
          <Library className="h-5 w-5" />
          My Content Library
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 huly-glass border-white/20"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40 huly-glass border-white/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="podcast">Podcasts</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredContents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Library className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No content found</p>
            {searchTerm && (
              <p className="text-sm">Try adjusting your search terms</p>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredContents.map((content) => (
              <Card key={content.id} className="huly-glass border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={content.thumbnailUrl}
                        alt={content.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute inset-0 bg-black/50 hover:bg-black/70 text-white border-0"
                        onClick={() => onPlay(content)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-white">{content.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {content.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {content.youtubeUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 hover:bg-white/10 hover:text-white"
                              onClick={() => window.open(content.youtubeUrl, '_blank')}
                            >
                              <Youtube className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 hover:bg-white/10 hover:text-white"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                            onClick={() => onDelete(content.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(content.createdAt), 'MMM d, yyyy')}
                        </div>
                        <span>{formatDuration(content.duration)}</span>
                        <Badge variant="secondary" className="bg-white/10 text-white border-0">
                          {content.type}
                        </Badge>
                      </div>

                      {content.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {content.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs border-white/20 text-muted-foreground"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
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

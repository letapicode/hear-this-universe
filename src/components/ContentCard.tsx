
import { Play, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContentCardProps {
  content: {
    id: string;
    title: string;
    author: string;
    category: string;
    episodes: number;
    duration: string;
    image: string;
    description?: string;
    isNew?: boolean;
    isPremium?: boolean;
  };
  onPlay: (content: any) => void;
  isCurrentlyPlaying: boolean;
  compact?: boolean;
}

const ContentCard = ({ content, onPlay, isCurrentlyPlaying, compact = false }: ContentCardProps) => {
  return (
    <Card className={`bg-card border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group ${
      isCurrentlyPlaying ? 'ring-2 ring-primary shadow-lg' : 'shadow-sm'
    }`}>
      <CardContent className={compact ? "p-4" : "p-6"}>
        <div className={`flex ${compact ? 'space-x-4' : 'flex-col'} items-start`}>
          <div className={`${compact ? 'w-16 h-16' : 'w-full h-48'} bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden`}>
            <BookOpen className={`${compact ? 'h-6 w-6' : 'h-12 w-12'} text-primary/60`} />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                onClick={() => onPlay(content)}
                size="icon"
                className="bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
              >
                <Play className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex space-x-1">
              {content.isNew && (
                <Badge className="bg-red-500 text-white text-xs font-medium">NEW</Badge>
              )}
              {content.isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium">PRO</Badge>
              )}
            </div>
          </div>
          
          <div className={`${compact ? 'flex-1' : 'w-full'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-semibold text-foreground mb-1 group-hover:text-primary transition-colors leading-tight`}>
                  {content.title}
                </h3>
                <p className="text-muted-foreground text-sm font-medium">{content.author}</p>
              </div>
              <Badge variant="secondary" className="text-xs font-medium">
                {content.category}
              </Badge>
            </div>
            
            {content.description && !compact && (
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">{content.description}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <BookOpen className="h-3 w-3" />
                  <span>{content.episodes} eps</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{content.duration}</span>
                </span>
              </div>
              
              {!compact && (
                <Button
                  onClick={() => onPlay(content)}
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary hover:bg-primary/10 font-medium"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Play
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentCard;

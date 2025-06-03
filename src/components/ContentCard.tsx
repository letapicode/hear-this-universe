
import { Play, BookOpen, Clock, Star, Crown, Heart, Download, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

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
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Simulate some dynamic data
  const rating = 4.2 + Math.random() * 0.8;
  const progress = Math.random() > 0.7 ? Math.floor(Math.random() * 100) : undefined;
  const totalListeners = Math.floor(Math.random() * 50000) + 1000;

  if (compact) {
    return (
      <Card 
        className={`huly-card group overflow-hidden h-[120px] ${
          isCurrentlyPlaying ? 'ring-2 ring-primary huly-shadow-hover scale-[1.02]' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-4 h-full">
          <div className="flex gap-4 h-full">
            {/* Compact Image */}
            <div className="w-20 h-20 relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 shrink-0">
              <div className="absolute inset-0 huly-gradient opacity-60"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white/70" />
              </div>
              
              {/* Play overlay */}
              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}>
                <Button
                  onClick={() => onPlay(content)}
                  size="icon"
                  className="huly-gradient rounded-full w-8 h-8 p-0"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>

              {progress && progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1">
                  <Progress value={progress} className="h-full rounded-none" />
                </div>
              )}
            </div>
            
            {/* Compact Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="huly-text-sm font-bold text-foreground line-clamp-1 group-hover:huly-gradient-text transition-all duration-300">
                  {content.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{content.author}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-2.5 w-2.5 ${
                          star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {rating.toFixed(1)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{content.episodes} eps</span>
                  <span>•</span>
                  <span>{content.duration}</span>
                </div>
                
                <div className={`flex gap-1 transition-all duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLiked(!isLiked);
                    }}
                    className="w-6 h-6 p-0"
                  >
                    <Heart className={`h-3 w-3 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`huly-card group overflow-hidden h-[320px] ${
        isCurrentlyPlaying ? 'ring-2 ring-primary huly-shadow-hover scale-[1.02]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* Image Container */}
        <div className="h-40 relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
          <div className="absolute inset-0 huly-gradient opacity-60"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-white/70" />
          </div>
          
          {/* Play Button Overlay */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              onClick={() => onPlay(content)}
              size="icon"
              className="huly-gradient hover:scale-110 text-white rounded-full w-12 h-12 transition-all duration-200"
            >
              <Play className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {content.isNew && (
              <Badge className="bg-red-500 text-white text-xs font-bold px-2 py-1">
                NEW
              </Badge>
            )}
            {content.isPremium && (
              <Badge className="bg-amber-500 text-white text-xs font-bold px-2 py-1 flex items-center gap-1">
                <Crown className="h-3 w-3" />
                PRO
              </Badge>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className={`absolute top-2 right-2 flex gap-1 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className="w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full text-white"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full text-white"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          {progress && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1">
              <Progress value={progress} className="h-full rounded-none" />
            </div>
          )}
        </div>
        
        {/* Content Info */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="huly-text-base font-bold text-foreground line-clamp-2 group-hover:huly-gradient-text transition-all duration-300">
                  {content.title}
                </h3>
                <p className="huly-text-sm text-muted-foreground font-medium mt-1">
                  {content.author}
                </p>
              </div>
              <Badge variant="outline" className="huly-glass border-white/10 text-xs shrink-0 ml-2">
                {content.category}
              </Badge>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-1">
                {rating.toFixed(1)}
              </span>
            </div>

            {content.description && (
              <p className="text-muted-foreground leading-relaxed line-clamp-2 text-sm">
                {content.description}
              </p>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex items-center gap-3 text-muted-foreground text-xs">
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {content.episodes} eps
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {content.duration}
              </span>
            </div>
            
            <span className="text-xs text-muted-foreground">
              {totalListeners.toLocaleString()} listeners
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentCard;

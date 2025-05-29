
import { Play, BookOpen, Clock, Star, Crown } from "lucide-react";
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
    <Card className={`luxury-card group overflow-hidden ${
      isCurrentlyPlaying ? 'ring-2 ring-primary shadow-2xl scale-105' : ''
    } ${compact ? 'h-auto' : 'h-full'}`}>
      <CardContent className={compact ? "p-6" : "p-8"}>
        <div className={`${compact ? 'flex space-x-6' : 'space-y-6'} h-full`}>
          {/* Image Container */}
          <div className={`${compact ? 'w-20 h-20' : 'w-full h-64'} relative overflow-hidden rounded-2xl`}>
            <div className="absolute inset-0 luxury-gradient opacity-90"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className={`${compact ? 'h-8 w-8' : 'h-16 w-16'} text-white/90`} />
            </div>
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <Button
                onClick={() => onPlay(content)}
                size="icon"
                className="bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transform scale-0 group-hover:scale-100 transition-transform duration-300 w-16 h-16"
              >
                <Play className="h-8 w-8" />
              </Button>
            </div>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              {content.isNew && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold animate-pulse">
                  NEW
                </Badge>
              )}
              {content.isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold flex items-center">
                  <Crown className="h-3 w-3 mr-1" />
                  PRO
                </Badge>
              )}
            </div>
            
            {/* Floating particles for premium content */}
            {content.isPremium && (
              <>
                <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-float"></div>
                <div className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
              </>
            )}
          </div>
          
          <div className={`${compact ? 'flex-1' : 'flex-1 flex flex-col justify-between'} space-y-4`}>
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-foreground group-hover:luxury-gradient-text transition-all duration-300 leading-tight`}>
                    {content.title}
                  </h3>
                  <p className="text-lg text-muted-foreground font-medium mt-2">{content.author}</p>
                </div>
                <Badge 
                  variant="secondary" 
                  className="glass-morphism border-white/20 text-sm font-medium px-3 py-1"
                >
                  {content.category}
                </Badge>
              </div>
              
              {content.description && !compact && (
                <p className="text-muted-foreground leading-relaxed line-clamp-3 text-lg">
                  {content.description}
                </p>
              )}
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center space-x-6 text-muted-foreground">
                <span className="flex items-center space-x-2 text-sm">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="font-medium">{content.episodes} eps</span>
                </span>
                <span className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">{content.duration}</span>
                </span>
                {content.isPremium && (
                  <span className="flex items-center space-x-1 text-amber-500 text-sm">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-medium">Premium</span>
                  </span>
                )}
              </div>
              
              {!compact && (
                <Button
                  onClick={() => onPlay(content)}
                  variant="ghost"
                  className="text-primary hover:text-white hover:bg-primary/20 font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <Play className="h-4 w-4 mr-2" />
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

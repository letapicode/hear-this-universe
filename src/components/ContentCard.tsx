
import { Play, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContentCardProps {
  content: {
    id: number;
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
    <Card className={`bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group ${
      isCurrentlyPlaying ? 'ring-2 ring-purple-500' : ''
    }`}>
      <CardContent className={compact ? "p-4" : "p-6"}>
        <div className={`flex ${compact ? 'space-x-4' : 'flex-col'} items-start`}>
          <div className={`${compact ? 'w-16 h-16' : 'w-full h-48'} bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden`}>
            <BookOpen className={`${compact ? 'h-6 w-6' : 'h-12 w-12'} text-white/80`} />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                onClick={() => onPlay(content)}
                className="bg-white/20 hover:bg-white/30 text-white rounded-full w-12 h-12"
              >
                <Play className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex space-x-1">
              {content.isNew && (
                <Badge className="bg-red-500 text-white text-xs">NEW</Badge>
              )}
              {content.isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">PREMIUM</Badge>
              )}
            </div>
          </div>
          
          <div className={`${compact ? 'flex-1' : 'w-full'}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors`}>
                  {content.title}
                </h3>
                <p className="text-purple-300 text-sm">{content.author}</p>
              </div>
              <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                {content.category}
              </Badge>
            </div>
            
            {content.description && !compact && (
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{content.description}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-400">
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
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
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

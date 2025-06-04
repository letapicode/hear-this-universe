
import { Play, Pause, Heart, Download, MoreHorizontal, Star, Clock, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useCreateDownload } from "@/hooks/useDownloads";
import { toast } from "sonner";

interface EnhancedContentCardProps {
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
    rating?: number;
    progress?: number; // 0-100
    totalListeners?: number;
  };
  onPlay: (content: any) => void;
  currentlyPlaying?: any;
  size?: 'small' | 'medium' | 'large';
}

const EnhancedContentCard = ({ 
  content, 
  onPlay, 
  currentlyPlaying, 
  size = 'medium' 
}: EnhancedContentCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isPlaying = currentlyPlaying?.id === content.id;
  const createDownload = useCreateDownload();

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // For demo purposes, we'll use the content ID as both episode and series ID
      await createDownload.mutateAsync({ 
        episodeId: content.id, 
        seriesId: content.id 
      });
      toast.success(`"${content.title}" download started!`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to start download. Please try again.');
    }
  };

  const sizeClasses = {
    small: {
      card: 'h-[280px]',
      image: 'h-32',
      title: 'huly-text-sm',
      author: 'text-xs'
    },
    medium: {
      card: 'h-[320px]',
      image: 'h-40',
      title: 'huly-text-base',
      author: 'huly-text-sm'
    },
    large: {
      card: 'h-[360px]',
      image: 'h-48',
      title: 'huly-text-lg',
      author: 'huly-text-base'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <Card 
      className={`huly-card group ${currentSize.card} overflow-hidden ${
        isPlaying ? 'ring-2 ring-primary huly-shadow-hover scale-[1.02]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* Image Container */}
        <div className={`${currentSize.image} relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20`}>
          <div className="absolute inset-0 huly-gradient opacity-60"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Headphones className="h-12 w-12 text-white/70" />
          </div>
          
          {/* Play Button Overlay */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              onClick={() => onPlay(content)}
              size="icon"
              className="huly-gradient hover:scale-110 text-white rounded-full w-12 h-12 huly-shadow-lg transition-all duration-200 border-0"
            >
              {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white" />}
            </Button>
          </div>
          
          {/* Top Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {content.isNew && (
              <Badge className="bg-red-500 text-white text-xs font-bold px-2 py-1">
                NEW
              </Badge>
            )}
            {content.isPremium && (
              <Badge className="bg-amber-500 text-white text-xs font-bold px-2 py-1">
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
              className="w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full text-white hover:text-white"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              disabled={createDownload.isPending}
              className="w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full text-white hover:text-white"
            >
              <Download className={`h-4 w-4 ${createDownload.isPending ? 'animate-pulse' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full text-white hover:text-white"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          {content.progress && content.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1">
              <Progress value={content.progress} className="h-full rounded-none" />
            </div>
          )}
        </div>
        
        {/* Content Info */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className={`${currentSize.title} font-bold text-foreground line-clamp-2 group-hover:huly-gradient-text transition-all duration-300`}>
                  {content.title}
                </h3>
                <p className={`${currentSize.author} text-muted-foreground font-medium mt-1`}>
                  {content.author}
                </p>
              </div>
              <Badge variant="outline" className="huly-glass border-white/10 text-xs shrink-0 ml-2">
                {content.category}
              </Badge>
            </div>
            
            {/* Rating */}
            {content.rating && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= content.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-1">
                  {content.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex items-center gap-3 text-muted-foreground text-xs">
              <span className="flex items-center gap-1">
                <Headphones className="h-3 w-3" />
                {content.episodes} eps
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {content.duration}
              </span>
            </div>
            
            {content.totalListeners && (
              <span className="text-xs text-muted-foreground">
                {content.totalListeners.toLocaleString()} listeners
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedContentCard;

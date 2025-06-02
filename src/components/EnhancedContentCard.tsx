
import { useState } from "react";
import { Play, Download, Star, MessageSquare, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateDownload } from "@/hooks/useDownloads";
import { useSeriesReviews } from "@/hooks/useReviews";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ReviewsSection from "./ReviewsSection";

interface EnhancedContentCardProps {
  content: {
    id: string; // Changed from number to string to match UUID
    title: string;
    author: string;
    category: string;
    episodes: number;
    duration: string;
    image: string;
    description: string;
    isNew: boolean;
    isPremium: boolean;
  };
  onPlay: (content: any) => void;
  currentlyPlaying: any;
}

const EnhancedContentCard = ({ content, onPlay, currentlyPlaying }: EnhancedContentCardProps) => {
  const { user, subscription } = useAuth();
  const { data: reviews = [] } = useSeriesReviews(content.id);
  const createDownload = useCreateDownload();
  const { toast } = useToast();
  const [showReviews, setShowReviews] = useState(false);

  const isPlaying = currentlyPlaying?.id === content.id;
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const handleDownload = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to download content.",
        variant: "destructive"
      });
      return;
    }

    if (content.isPremium && !subscription?.subscribed) {
      toast({
        title: "Premium Required",
        description: "This content requires a premium subscription.",
        variant: "destructive"
      });
      return;
    }

    try {
      // For demo, we'll use the content ID as both episode and series ID
      await createDownload.mutateAsync({
        episodeId: content.id,
        seriesId: content.id
      });
      
      toast({
        title: "Download started",
        description: `${content.title} is being downloaded.`
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="glass-morphism border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 hover:scale-105">
      <CardContent className="p-0">
        <div className="relative">
          <div className="w-full h-64 luxury-gradient rounded-t-xl flex items-center justify-center">
            <div className="w-32 h-32 bg-white/20 rounded-xl animate-pulse"></div>
          </div>
          
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {content.isNew && (
              <Badge className="bg-green-500/80 text-white">New</Badge>
            )}
            {content.isPremium && (
              <Badge className="bg-yellow-500/80 text-white">Premium</Badge>
            )}
          </div>

          {averageRating > 0 && (
            <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/60 rounded-full px-2 py-1">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs font-medium">
                {averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-white text-lg mb-1 leading-tight">
              {content.title}
            </h3>
            <div className="flex items-center text-gray-400 text-sm space-x-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {content.author}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {content.duration}
              </div>
            </div>
          </div>

          <p className="text-gray-300 text-sm line-clamp-2">
            {content.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{content.episodes} episodes</span>
            <span>{content.category}</span>
          </div>

          {/* Reviews Preview */}
          {reviews.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 text-sm">
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReviews(!showReviews)}
                className="text-purple-400 hover:text-purple-300"
              >
                {showReviews ? 'Hide' : 'Show'} Reviews
              </Button>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={() => onPlay(content)}
              className={`luxury-button flex-1 ${isPlaying ? 'animate-pulse' : ''}`}
            >
              <Play className="h-4 w-4 mr-2" />
              {isPlaying ? 'Playing' : 'Play'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={createDownload.isPending}
              className="glass-morphism border-white/20 hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showReviews && (
          <div className="border-t border-white/10 p-6">
            <ReviewsSection seriesId={content.id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedContentCard;

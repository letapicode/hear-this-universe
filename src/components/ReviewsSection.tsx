
import { useState } from "react";
import { useSeriesReviews, useUserReview, useCreateReview } from "@/hooks/useReviews";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReviewsSectionProps {
  seriesId: string;
}

const ReviewsSection = ({ seriesId }: ReviewsSectionProps) => {
  const { user } = useAuth();
  const { data: reviews = [] } = useSeriesReviews(seriesId);
  const { data: userReview } = useUserReview(seriesId);
  const createReview = useCreateReview();
  const { toast } = useToast();
  
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [rating, setRating] = useState(userReview?.rating || 0);
  const [reviewText, setReviewText] = useState(userReview?.review_text || '');

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to write a review.",
        variant: "destructive"
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Please add a rating",
        description: "You need to rate the audiobook before submitting.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createReview.mutateAsync({
        seriesId,
        rating,
        reviewText: reviewText.trim() || undefined
      });
      
      setIsWritingReview(false);
      toast({
        title: "Review submitted",
        description: "Thank you for your review!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const StarRating = ({ rating: currentRating, onRatingChange, readonly = false }: {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
  }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 cursor-pointer transition-colors ${
            star <= currentRating 
              ? 'text-yellow-400 fill-yellow-400' 
              : 'text-gray-400'
          }`}
          onClick={() => !readonly && onRatingChange?.(star)}
        />
      ))}
    </div>
  );

  return (
    <Card className="glass-morphism border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Reviews ({reviews.length})
          </div>
          {averageRating > 0 && (
            <div className="flex items-center space-x-2">
              <StarRating rating={averageRating} readonly />
              <span className="text-yellow-400 font-semibold">
                {averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Write Review Section */}
        {user && (
          <div className="space-y-4">
            {!isWritingReview && !userReview ? (
              <Button 
                onClick={() => setIsWritingReview(true)}
                className="luxury-button"
              >
                Write a Review
              </Button>
            ) : (isWritingReview || userReview) && (
              <div className="space-y-4 glass-morphism p-4 rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Rating
                  </label>
                  <StarRating rating={rating} onRatingChange={setRating} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Review (Optional)
                  </label>
                  <Textarea
                    placeholder="Share your thoughts about this audiobook..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="glass-morphism border-white/20 text-white"
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={createReview.isPending}
                    className="luxury-button"
                  >
                    {userReview ? 'Update Review' : 'Submit Review'}
                  </Button>
                  {isWritingReview && (
                    <Button 
                      variant="outline"
                      onClick={() => setIsWritingReview(false)}
                      className="glass-morphism border-white/20"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <div key={review.id} className="glass-morphism p-4 rounded-xl">
              <div className="flex items-start space-x-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={review.user_profiles?.avatar_url} />
                  <AvatarFallback className="luxury-gradient text-white">
                    {review.user_profiles?.display_name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">
                      {review.user_profiles?.display_name || 'Anonymous'}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <StarRating rating={review.rating} readonly />
                      <span className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {review.review_text && (
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {review.review_text}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {reviews.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewsSection;

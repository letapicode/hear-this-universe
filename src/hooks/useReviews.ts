
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useSeriesReviews = (seriesId: string) => {
  return useQuery({
    queryKey: ['series-reviews', seriesId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user_profiles (display_name, avatar_url)
        `)
        .eq('series_id', seriesId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUserReview = (seriesId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-review', seriesId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('series_id', seriesId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ seriesId, rating, reviewText }: { 
      seriesId: string; 
      rating: number; 
      reviewText?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('reviews')
        .upsert({
          user_id: user.id,
          series_id: seriesId,
          rating,
          review_text: reviewText,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['series-reviews', data.series_id] });
      queryClient.invalidateQueries({ queryKey: ['user-review', data.series_id] });
    },
  });
};

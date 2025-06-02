
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserDownloads = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-downloads', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('downloads')
        .select(`
          *,
          episodes (title, episode_number),
          series (title, author, cover_image_url)
        `)
        .eq('user_id', user.id)
        .order('downloaded_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateDownload = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ episodeId, seriesId }: { episodeId: string; seriesId: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      // In a real app, this would generate a secure download URL
      const { data, error } = await supabase
        .from('downloads')
        .insert({
          user_id: user.id,
          episode_id: episodeId,
          series_id: seriesId,
          download_url: `https://example.com/download/${episodeId}`,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-downloads'] });
    },
  });
};

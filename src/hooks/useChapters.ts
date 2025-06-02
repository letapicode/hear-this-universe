
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useEpisodeChapters = (episodeId: string) => {
  return useQuery({
    queryKey: ['episode-chapters', episodeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('episode_id', episodeId)
        .order('chapter_number');
      
      if (error) throw error;
      return data;
    },
    enabled: !!episodeId,
  });
};

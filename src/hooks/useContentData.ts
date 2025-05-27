
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useSeries = () => {
  return useQuery({
    queryKey: ['series'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('series')
        .select(`
          *,
          categories (
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useEpisodes = (seriesId?: string) => {
  return useQuery({
    queryKey: ['episodes', seriesId],
    queryFn: async () => {
      if (!seriesId) return [];
      
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('series_id', seriesId)
        .order('episode_number');
      
      if (error) throw error;
      return data;
    },
    enabled: !!seriesId,
  });
};

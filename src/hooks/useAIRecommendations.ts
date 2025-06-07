
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAIRecommendations = (type?: string) => {
  return useQuery({
    queryKey: ['ai-recommendations', type],
    queryFn: async () => {
      const query = supabase
        .from('ai_recommendations')
        .select(`
          *,
          series:series_id(*)
        `)
        .order('created_at', { ascending: false });

      if (type) {
        query.eq('recommendation_type', type);
      }

      const { data, error } = await query.limit(10);
      if (error) throw error;
      return data || [];
    },
  });
};

export const useUserPreferences = () => {
  return useQuery({
    queryKey: ['user-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });
};

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: existingPrefs } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingPrefs) {
        const { data, error } = await supabase
          .from('user_preferences')
          .update({
            ...preferences,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPrefs.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('user_preferences')
          .insert({
            ...preferences,
            user_id: user.id
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
      toast.success("Preferences updated!");
    },
    onError: (error) => {
      console.error('Error updating preferences:', error);
      toast.error("Failed to update preferences");
    }
  });
};

export const useCreateMoodSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session: {
      mood: string;
      activity?: string;
      time_of_day?: string;
      content_consumed?: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('mood_sessions')
        .insert({
          ...session,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-sessions'] });
    }
  });
};

export const useUpdateRecommendationFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      recommendationId, 
      clicked, 
      dismissed 
    }: { 
      recommendationId: string; 
      clicked?: boolean; 
      dismissed?: boolean; 
    }) => {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .update({ clicked, dismissed })
        .eq('id', recommendationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-recommendations'] });
    }
  });
};


import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SavedVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  audio_url: string | null;
  thumbnail_url: string | null;
  video_type: string;
  duration_seconds: number | null;
  tags: string[] | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export const useVideoStorage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const saveVideo = async (videoData: {
    title: string;
    description?: string;
    videoUrl?: string;
    audioUrl?: string;
    thumbnailUrl?: string;
    videoType?: string;
    durationSeconds?: number;
    tags?: string[];
    metadata?: any;
  }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('save-video', {
        body: videoData,
      });

      if (error) throw error;

      toast.success('Video saved successfully!');
      return data.video;
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Failed to save video');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserVideos = async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
  }) => {
    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.type) searchParams.append('type', params.type);
      if (params?.search) searchParams.append('search', params.search);

      const { data, error } = await supabase.functions.invoke('save-video', {
        method: 'GET',
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to fetch videos');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVideo = async (videoId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('save-video', {
        method: 'DELETE',
        body: { id: videoId },
      });

      if (error) throw error;

      toast.success('Video deleted successfully!');
      return data;
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveVideo,
    getUserVideos,
    deleteVideo,
    isLoading,
  };
};

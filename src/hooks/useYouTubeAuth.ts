
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface YouTubeConnection {
  id: string;
  access_token: string;
  channel_id: string | null;
  channel_name: string | null;
  connected_at: string;
}

export const useYouTubeAuth = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connection, setConnection] = useState<YouTubeConnection | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('youtube_connections')
        .select('*')
        .single();

      if (data && !error) {
        setConnection(data);
        setIsConnected(true);
      } else {
        setConnection(null);
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error checking YouTube connection:', error);
      setConnection(null);
      setIsConnected(false);
    }
  };

  const startAuth = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('youtube-auth', {
        body: { action: 'getAuthUrl' },
      });

      if (error) throw error;

      // Open YouTube auth in a new window
      window.open(data.authUrl, 'youtube-auth', 'width=500,height=600');

      // Listen for auth completion
      const handleMessage = async (event: MessageEvent) => {
        if (event.data?.type === 'youtube-auth-success') {
          window.removeEventListener('message', handleMessage);
          await handleAuthCallback(event.data.code);
        }
      };

      window.addEventListener('message', handleMessage);
    } catch (error) {
      console.error('Error starting YouTube auth:', error);
      toast.error('Failed to start YouTube authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthCallback = async (code: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('youtube-auth', {
        body: { action: 'exchangeCode', code },
      });

      if (error) throw error;

      await checkConnection();
      toast.success('Successfully connected to YouTube!');
    } catch (error) {
      console.error('Error handling auth callback:', error);
      toast.error('Failed to connect to YouTube');
    }
  };

  const disconnect = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('youtube-auth', {
        body: { action: 'disconnect' },
      });

      if (error) throw error;

      setConnection(null);
      setIsConnected(false);
      toast.success('Disconnected from YouTube');
    } catch (error) {
      console.error('Error disconnecting YouTube:', error);
      toast.error('Failed to disconnect from YouTube');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadVideo = async (videoId: string, settings: {
    title: string;
    description: string;
    tags: string[];
    privacy: string;
    thumbnail?: string;
  }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('youtube-upload', {
        body: { videoId, ...settings },
      });

      if (error) throw error;

      toast.success('Video uploaded to YouTube successfully!');
      return data;
    } catch (error) {
      console.error('Error uploading to YouTube:', error);
      toast.error('Failed to upload to YouTube');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    connection,
    isLoading,
    startAuth,
    disconnect,
    uploadVideo,
    checkConnection,
  };
};

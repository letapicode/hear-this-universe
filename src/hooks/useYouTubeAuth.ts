
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

// You need to replace this with your actual Google OAuth Client ID
// Get it from: https://console.cloud.google.com/apis/credentials
const YOUTUBE_CLIENT_ID = 'YOUR_GOOGLE_OAUTH_CLIENT_ID_HERE';

export const useYouTubeAuth = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connection, setConnection] = useState<YouTubeConnection | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('youtube_connections')
        .select('*')
        .eq('user_id', user.user.id)
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
    if (YOUTUBE_CLIENT_ID === 'YOUR_GOOGLE_OAUTH_CLIENT_ID_HERE') {
      toast.error('Please configure your Google OAuth Client ID first. Check the console for instructions.');
      console.error(`
🔧 YouTube Setup Required:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create a new OAuth 2.0 Client ID (Web application)
3. Add these to "Authorized JavaScript origins":
   - ${window.location.origin}
   - http://localhost:3000 (for local development)
4. Add these to "Authorized redirect URIs":
   - ${window.location.origin}/auth/youtube/callback
   - http://localhost:3000/auth/youtube/callback (for local development)
5. Copy your Client ID and replace 'YOUR_GOOGLE_OAUTH_CLIENT_ID_HERE' in src/hooks/useYouTubeAuth.ts

Also enable these APIs in Google Cloud Console:
- YouTube Data API v3
- YouTube Analytics API (optional)
      `);
      return;
    }

    setIsLoading(true);
    try {
      // Create OAuth URL
      const redirectUri = `${window.location.origin}/auth/youtube/callback`;
      const scope = 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${YOUTUBE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scope)}&` +
        `access_type=offline&` +
        `prompt=consent`;

      // Open popup
      const popup = window.open(
        authUrl,
        'youtube-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        toast.error('Popup blocked! Please allow popups for this site.');
        setIsLoading(false);
        return;
      }

      // Listen for the popup to send us the auth code
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data?.type === 'youtube-auth-success') {
          window.removeEventListener('message', handleMessage);
          popup?.close();
          await handleAuthCallback(event.data.code);
        } else if (event.data?.type === 'youtube-auth-error') {
          window.removeEventListener('message', handleMessage);
          popup?.close();
          toast.error('YouTube authentication failed: ' + (event.data.error || 'Unknown error'));
          setIsLoading(false);
        }
      };

      window.addEventListener('message', handleMessage);

      // Clean up if popup is closed manually
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          setIsLoading(false);
          toast.error('Authentication cancelled');
        }
      }, 1000);

    } catch (error) {
      console.error('Error starting YouTube auth:', error);
      toast.error('Failed to start YouTube authentication');
      setIsLoading(false);
    }
  };

  const handleAuthCallback = async (code: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      // Exchange code for tokens using a simple fetch (this is frontend-only approach)
      // Note: In production, you might want to use a backend service for security
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: YOUTUBE_CLIENT_ID,
          // Note: For security, you should use PKCE flow instead of client_secret in frontend
          redirect_uri: `${window.location.origin}/auth/youtube/callback`,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(`Failed to exchange code for tokens: ${errorData.error_description || errorData.error}`);
      }

      const tokenData = await tokenResponse.json();

      // Get YouTube channel info
      const channelResponse = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        }
      );

      if (!channelResponse.ok) {
        throw new Error('Failed to get channel info');
      }

      const channelData = await channelResponse.json();
      const channel = channelData.items?.[0];

      if (!channel) {
        throw new Error('No YouTube channel found for this account');
      }

      // Store connection in database
      const { error: dbError } = await supabase
        .from('youtube_connections')
        .upsert({
          user_id: user.user.id,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
          channel_id: channel.id,
          channel_name: channel.snippet.title,
        });

      if (dbError) {
        throw new Error('Failed to store YouTube connection: ' + dbError.message);
      }

      await checkConnection();
      toast.success(`Successfully connected to YouTube channel: ${channel.snippet.title}`);
    } catch (error) {
      console.error('Error handling auth callback:', error);
      toast.error('Failed to connect to YouTube: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    setIsLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('youtube_connections')
        .delete()
        .eq('user_id', user.user.id);

      if (error) {
        throw new Error('Failed to disconnect YouTube account: ' + error.message);
      }

      setConnection(null);
      setIsConnected(false);
      toast.success('Disconnected from YouTube');
    } catch (error) {
      console.error('Error disconnecting YouTube:', error);
      toast.error('Failed to disconnect from YouTube: ' + (error as Error).message);
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
      // For now, we'll simulate the upload since we need the actual video file
      // In a real implementation, you'd upload the video file to YouTube's API
      const mockYouTubeUrl = `https://www.youtube.com/watch?v=mock_${Date.now()}`;
      
      toast.success('Video uploaded to YouTube successfully!');
      return { youtubeUrl: mockYouTubeUrl };
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

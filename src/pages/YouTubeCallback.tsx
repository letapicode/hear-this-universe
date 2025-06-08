
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const YouTubeCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        // Send error message to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'youtube-auth-error',
            error: error
          }, window.location.origin);
          window.close();
        } else {
          navigate('/');
        }
        return;
      }

      if (code) {
        // Send success message to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'youtube-auth-success',
            code: code
          }, window.location.origin);
          window.close();
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
      <Card className="huly-glass border-white/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
            <span className="text-white">Completing YouTube authentication...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubeCallback;

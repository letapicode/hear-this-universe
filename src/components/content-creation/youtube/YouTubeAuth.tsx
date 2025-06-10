
import { useYouTubeAuth } from "@/hooks/useYouTubeAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube, CheckCircle, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface YouTubeAuthProps {
  onAuthSuccess?: (connection: any) => void;
}

const YouTubeAuth = ({ onAuthSuccess }: YouTubeAuthProps) => {
  const { isConnected, connection, isLoading, startAuth, disconnect } = useYouTubeAuth();

  const handleConnect = async () => {
    await startAuth();
    if (onAuthSuccess && connection) {
      onAuthSuccess(connection);
    }
  };

  if (isConnected && connection) {
    return (
      <Card className="huly-glass border-white/10">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Connected to YouTube</span>
            </div>
            
            {connection.channel_name && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Channel: <span className="font-medium text-white">{connection.channel_name}</span>
                </p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={disconnect}
                disabled={isLoading}
                variant="outline"
                className="flex-1 border-white/20 hover:bg-white/10 hover:text-white"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  "Disconnect"
                )}
              </Button>
              
              {connection.channel_id && (
                <Button
                  onClick={() => window.open(`https://youtube.com/channel/${connection.channel_id}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="huly-glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 huly-gradient-text">
          <Youtube className="h-5 w-5" />
          Connect YouTube Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-amber-500/50 bg-amber-500/10">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            Setup required: Please configure your Google OAuth Client ID in the code. 
            Check the browser console for detailed instructions after clicking "Connect".
          </AlertDescription>
        </Alert>

        <p className="text-muted-foreground">
          Connect your YouTube account to automatically upload videos directly from this platform.
        </p>
        
        <Button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full huly-gradient text-white border-0 hover:opacity-90"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Youtube className="h-4 w-4 mr-2" />
              Connect YouTube Account
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>To set this up:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Cloud Console</a></li>
            <li>Create an OAuth 2.0 Client ID</li>
            <li>Configure authorized origins and redirect URIs</li>
            <li>Replace the client ID in the code</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubeAuth;

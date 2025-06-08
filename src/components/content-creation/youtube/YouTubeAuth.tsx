
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface YouTubeAuthProps {
  onAuthSuccess: (accessToken: string) => void;
  isAuthenticated: boolean;
}

const YouTubeAuth = ({ onAuthSuccess, isAuthenticated }: YouTubeAuthProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful authentication
      const mockToken = 'mock_youtube_access_token_' + Date.now();
      onAuthSuccess(mockToken);
      toast.success("Successfully connected to YouTube!");
      
    } catch (error) {
      toast.error("Failed to connect to YouTube");
    } finally {
      setIsConnecting(false);
    }
  };

  if (isAuthenticated) {
    return (
      <Card className="huly-glass border-white/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Connected to YouTube</span>
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
        <p className="text-muted-foreground">
          Connect your YouTube account to automatically upload videos directly from this platform.
        </p>
        
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full huly-gradient text-white border-0 hover:opacity-90"
        >
          {isConnecting ? (
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
      </CardContent>
    </Card>
  );
};

export default YouTubeAuth;


import { Play, BookOpen, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HeroSectionProps {
  user: any;
  featuredContent: any[];
  onPlay: (content: any) => void;
}

const HeroSection = ({ user, featuredContent, onPlay }: HeroSectionProps) => {
  return (
    <section className="container mx-auto px-8 py-20">
      <div className="text-center mb-20 animate-fade-in">
        <div className="inline-flex items-center space-x-3 mb-8 glass-morphism px-6 py-3 rounded-full">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          <span className="text-lg font-medium text-muted-foreground">Premium Experience</span>
        </div>
        
        <h2 className="text-7xl font-bold mb-8 leading-tight animate-slide-up">
          Welcome back, <span className="luxury-gradient-text animate-glow">{user.user_metadata?.full_name || 'Listener'}</span>
        </h2>
        <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Immerse yourself in a world of captivating stories and premium audio content
        </p>
        
        <div className="flex items-center justify-center space-x-8 text-lg text-muted-foreground animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span>10,000+ Stories</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Premium Quality</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Ad-Free Experience</span>
          </div>
        </div>
      </div>

      {/* Enhanced Featured Story */}
      {featuredContent.length > 0 && (
        <Card className="luxury-card mb-20 animate-scale-in overflow-hidden" style={{ animationDelay: '0.6s' }}>
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0 items-center min-h-[500px]">
              <div className="p-12 space-y-8">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="luxury-gradient text-white px-6 py-3 rounded-full text-lg font-bold flex items-center shadow-lg">
                    <Star className="h-5 w-5 mr-2" />
                    Featured Story
                  </span>
                  {featuredContent[0].isNew && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                      NEW
                    </span>
                  )}
                  {featuredContent[0].isPremium && (
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      PREMIUM
                    </span>
                  )}
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-5xl font-bold text-foreground leading-tight">
                    {featuredContent[0].title}
                  </h3>
                  <p className="text-2xl luxury-gradient-text font-semibold">
                    by {featuredContent[0].author}
                  </p>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {featuredContent[0].description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-8 text-lg">
                  <span className="flex items-center space-x-2 text-muted-foreground">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="font-medium">{featuredContent[0].episodes} episodes</span>
                  </span>
                  <span className="flex items-center space-x-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-medium">{featuredContent[0].duration}</span>
                  </span>
                </div>
                
                <Button 
                  onClick={() => onPlay(featuredContent[0])}
                  className="luxury-button text-xl px-10 py-6 group"
                >
                  <Play className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                  Start Your Journey
                </Button>
              </div>
              
              <div className="relative p-12">
                <div className="aspect-square luxury-gradient rounded-3xl flex items-center justify-center relative overflow-hidden group">
                  <BookOpen className="h-32 w-32 text-white/90 group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Floating elements */}
                  <div className="absolute top-8 right-8 w-6 h-6 bg-white/20 rounded-full animate-float"></div>
                  <div className="absolute bottom-12 left-12 w-4 h-4 bg-white/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-1/2 left-8 w-3 h-3 bg-white/25 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default HeroSection;

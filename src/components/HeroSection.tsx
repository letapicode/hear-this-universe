
import { Play, BookOpen, Star, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HeroSectionProps {
  user: any;
  featuredContent: any[];
  onPlay: (content: any) => void;
}

const HeroSection = ({ user, featuredContent, onPlay }: HeroSectionProps) => {
  return (
    <section className="huly-section">
      <div className="huly-container">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-3 mb-8 huly-glass px-6 py-3 rounded-full huly-shadow">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="huly-text-sm font-medium text-muted-foreground">Premium Audio Experience</span>
          </div>
          
          <h1 className="huly-text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-slide-up">
            Welcome back, 
            <br />
            <span className="huly-gradient-text animate-glow">
              {user.user_metadata?.full_name || 'Listener'}
            </span>
          </h1>
          
          <p className="huly-text-lg text-muted-foreground max-w-3xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Immerse yourself in a world of captivating stories and premium audio content designed for the modern listener
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-8 huly-text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>10,000+ Premium Stories</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Studio Quality Audio</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Ad-Free Experience</span>
            </div>
          </div>
        </div>

        {/* Featured Content */}
        {featuredContent.length > 0 && (
          <Card className="huly-card mb-16 animate-scale-in overflow-hidden" style={{ animationDelay: '0.6s' }}>
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0 items-center min-h-[480px]">
                <div className="p-12 space-y-8">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="huly-gradient text-white px-6 py-3 rounded-xl huly-text-sm font-semibold flex items-center huly-shadow-lg">
                      <Star className="h-4 w-4 mr-2" />
                      Featured Story
                    </span>
                    {featuredContent[0].isNew && (
                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl huly-text-sm font-semibold animate-pulse">
                        NEW
                      </span>
                    )}
                    {featuredContent[0].isPremium && (
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl huly-text-sm font-semibold">
                        PREMIUM
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <h2 className="huly-text-3xl md:text-4xl font-bold text-foreground leading-tight">
                      {featuredContent[0].title}
                    </h2>
                    <p className="huly-text-xl huly-gradient-text font-semibold">
                      by {featuredContent[0].author}
                    </p>
                    <p className="huly-text-base text-muted-foreground leading-relaxed">
                      {featuredContent[0].description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6 huly-text-base">
                    <span className="flex items-center space-x-2 text-muted-foreground">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span className="font-medium">{featuredContent[0].episodes} episodes</span>
                    </span>
                    <span className="flex items-center space-x-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="font-medium">{featuredContent[0].duration}</span>
                    </span>
                  </div>
                  
                  <Button 
                    onClick={() => onPlay(featuredContent[0])}
                    className="huly-button huly-text-lg px-8 py-4 group"
                  >
                    <Play className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                    Start Your Journey
                    <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                
                <div className="relative p-12">
                  <div className="aspect-square huly-gradient rounded-3xl flex items-center justify-center relative overflow-hidden group huly-shadow-lg">
                    <BookOpen className="h-24 w-24 text-white/90 group-hover:scale-110 transition-transform duration-500" />
                    
                    {/* Floating elements */}
                    <div className="absolute top-8 right-8 w-4 h-4 bg-white/20 rounded-full animate-float"></div>
                    <div className="absolute bottom-12 left-12 w-3 h-3 bg-white/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-8 w-2 h-2 bg-white/25 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default HeroSection;

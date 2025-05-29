
import { Play, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HeroSectionProps {
  user: any;
  featuredContent: any[];
  onPlay: (content: any) => void;
}

const HeroSection = ({ user, featuredContent, onPlay }: HeroSectionProps) => {
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-5xl font-bold mb-6 text-foreground leading-tight">
          Welcome back, <span className="text-primary">{user.user_metadata?.full_name || 'Listener'}</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Continue your audio journey with thousands of captivating stories and podcasts
        </p>
      </div>

      {/* Featured Story Highlight */}
      {featuredContent.length > 0 && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mb-16 animate-slide-up">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Featured
                  </span>
                  {featuredContent[0].isNew && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">NEW</span>
                  )}
                </div>
                <h3 className="text-3xl font-bold mb-2 text-foreground">{featuredContent[0].title}</h3>
                <p className="text-primary mb-4 font-medium">by {featuredContent[0].author}</p>
                <p className="text-muted-foreground mb-6 leading-relaxed">{featuredContent[0].description}</p>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{featuredContent[0].episodes} episodes</span>
                  </span>
                  <span className="text-sm text-muted-foreground">{featuredContent[0].duration}</span>
                </div>
                <Button 
                  onClick={() => onPlay(featuredContent[0])}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3 font-medium"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Listening
                </Button>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                  <BookOpen className="h-24 w-24 text-primary/60" />
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

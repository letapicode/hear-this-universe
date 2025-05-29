
import { TrendingUp, Fire } from "lucide-react";
import ContentCard from "@/components/ContentCard";

interface TrendingSectionProps {
  trendingContent: any[];
  onPlay: (content: any) => void;
  currentlyPlaying: any;
}

const TrendingSection = ({ trendingContent, onPlay, currentlyPlaying }: TrendingSectionProps) => {
  if (trendingContent.length === 0) return null;

  return (
    <section className="container mx-auto px-8 mb-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-3 mb-6 glass-morphism px-6 py-3 rounded-full">
          <Fire className="h-5 w-5 text-orange-500 animate-pulse" />
          <span className="text-lg font-medium text-muted-foreground">Hot Content</span>
        </div>
        <div className="flex items-center justify-center space-x-4 mb-4">
          <TrendingUp className="h-8 w-8 text-primary animate-bounce" />
          <h3 className="text-5xl font-bold luxury-gradient-text">Trending Now</h3>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          The most popular stories everyone is talking about
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {trendingContent.map((content, index) => (
          <div 
            key={content.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <ContentCard 
              content={content}
              onPlay={onPlay}
              isCurrentlyPlaying={currentlyPlaying?.id === content.id}
              compact
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;

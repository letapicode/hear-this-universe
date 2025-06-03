
import { TrendingUp, Flame } from "lucide-react";
import ContentCard from "@/components/ContentCard";

interface TrendingSectionProps {
  trendingContent: any[];
  onPlay: (content: any) => void;
  currentlyPlaying: any;
}

const TrendingSection = ({ trendingContent, onPlay, currentlyPlaying }: TrendingSectionProps) => {
  if (trendingContent.length === 0) return null;

  return (
    <section className="huly-section">
      <div className="huly-container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-6 huly-glass px-6 py-3 rounded-full huly-shadow">
            <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
            <span className="huly-text-sm font-medium text-muted-foreground">Hot Content</span>
          </div>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <TrendingUp className="h-8 w-8 text-primary animate-bounce" />
            <h3 className="huly-text-3xl md:text-4xl font-bold huly-gradient-text">Trending Now</h3>
          </div>
          <p className="huly-text-lg text-muted-foreground max-w-3xl mx-auto">
            The most popular stories everyone is talking about
          </p>
        </div>
        
        <div className="huly-grid lg:grid-cols-2">
          {trendingContent.map((content, index) => (
            <div 
              key={content.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
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
      </div>
    </section>
  );
};

export default TrendingSection;


import { TrendingUp } from "lucide-react";
import ContentCard from "@/components/ContentCard";

interface TrendingSectionProps {
  trendingContent: any[];
  onPlay: (content: any) => void;
  currentlyPlaying: any;
}

const TrendingSection = ({ trendingContent, onPlay, currentlyPlaying }: TrendingSectionProps) => {
  if (trendingContent.length === 0) return null;

  return (
    <section className="container mx-auto px-6 mb-16">
      <div className="flex items-center space-x-2 mb-8">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h3 className="text-2xl font-bold text-foreground">Trending Now</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trendingContent.map((content) => (
          <ContentCard 
            key={content.id}
            content={content}
            onPlay={onPlay}
            isCurrentlyPlaying={currentlyPlaying?.id === content.id}
            compact
          />
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;

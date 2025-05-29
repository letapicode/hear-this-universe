
import { BookOpen, Sparkles } from "lucide-react";
import ContentCard from "@/components/ContentCard";

interface ContentLibraryProps {
  filteredContent: any[];
  onPlay: (content: any) => void;
  currentlyPlaying: any;
}

const ContentLibrary = ({ filteredContent, onPlay, currentlyPlaying }: ContentLibraryProps) => {
  return (
    <section className="container mx-auto px-8 mb-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-3 mb-6 glass-morphism px-6 py-3 rounded-full">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-lg font-medium text-muted-foreground">Curated Collection</span>
        </div>
        <h3 className="text-5xl font-bold mb-4 luxury-gradient-text">Discover Stories</h3>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore our handpicked selection of premium audio content
        </p>
      </div>
      
      {filteredContent.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-scale-in">
          {filteredContent.map((content, index) => (
            <div 
              key={content.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ContentCard 
                content={content}
                onPlay={onPlay}
                isCurrentlyPlaying={currentlyPlaying?.id === content.id}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="glass-morphism rounded-3xl p-16 max-w-2xl mx-auto">
            <BookOpen className="h-24 w-24 mx-auto mb-8 text-primary/60 animate-float" />
            <h4 className="text-3xl font-bold text-foreground mb-4">No Stories Found</h4>
            <p className="text-xl text-muted-foreground">
              Try adjusting your search or explore different categories
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContentLibrary;

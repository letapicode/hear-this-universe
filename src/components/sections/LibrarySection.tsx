
import EnhancedContentCard from "@/components/EnhancedContentCard";
import { BookOpen, Search } from "lucide-react";

interface LibrarySectionProps {
  filteredContent: any[];
  onPlay: (content: any) => void;
  currentlyPlaying: any;
}

const LibrarySection = ({ filteredContent, onPlay, currentlyPlaying }: LibrarySectionProps) => {
  return (
    <section className="huly-section">
      <div className="huly-container">
        <div className="flex items-center justify-between mb-12">
          <h2 className="huly-text-3xl font-bold huly-gradient-text">
            Your Library
          </h2>
          <div className="text-muted-foreground huly-text-sm">
            {filteredContent.length} audiobook{filteredContent.length !== 1 ? 's' : ''}
          </div>
        </div>

        {filteredContent.length === 0 ? (
          <div className="text-center py-20">
            <div className="huly-gradient w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center huly-shadow-lg">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h3 className="huly-text-xl font-semibold text-white mb-4">No audiobooks found</h3>
            <p className="text-muted-foreground max-w-md mx-auto huly-text-base">
              Try adjusting your search terms or filters to find more content.
            </p>
          </div>
        ) : (
          <div className="huly-grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredContent.map((content, index) => (
              <div
                key={content.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <EnhancedContentCard
                  content={content}
                  onPlay={onPlay}
                  currentlyPlaying={currentlyPlaying}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LibrarySection;

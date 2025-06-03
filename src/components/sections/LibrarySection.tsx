
import EnhancedContentCard from "@/components/EnhancedContentCard";
import { BookOpen } from "lucide-react";

interface LibrarySectionProps {
  filteredContent: any[];
  onPlay: (content: any) => void;
  currentlyPlaying: any;
}

const LibrarySection = ({ filteredContent, onPlay, currentlyPlaying }: LibrarySectionProps) => {
  return (
    <section className="container mx-auto px-8 mb-20">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-4xl font-bold luxury-gradient-text">
          Your Library
        </h2>
        <div className="text-gray-400">
          {filteredContent.length} audiobook{filteredContent.length !== 1 ? 's' : ''}
        </div>
      </div>

      {filteredContent.length === 0 ? (
        <div className="text-center py-20">
          <div className="luxury-gradient w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
            <div className="w-10 h-10 bg-white/20 rounded-full"></div>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-4">No audiobooks found</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Try adjusting your search terms or filters to find more content.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredContent.map((content) => (
            <EnhancedContentCard
              key={content.id}
              content={content}
              onPlay={onPlay}
              currentlyPlaying={currentlyPlaying}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default LibrarySection;

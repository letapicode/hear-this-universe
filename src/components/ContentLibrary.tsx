
import { BookOpen } from "lucide-react";
import ContentCard from "@/components/ContentCard";

interface ContentLibraryProps {
  filteredContent: any[];
  onPlay: (content: any) => void;
  currentlyPlaying: any;
}

const ContentLibrary = ({ filteredContent, onPlay, currentlyPlaying }: ContentLibraryProps) => {
  return (
    <section className="container mx-auto px-6 mb-16">
      <h3 className="text-2xl font-bold mb-8 text-foreground">Discover Stories</h3>
      {filteredContent.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
          {filteredContent.map((content) => (
            <ContentCard 
              key={content.id}
              content={content}
              onPlay={onPlay}
              isCurrentlyPlaying={currentlyPlaying?.id === content.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-16">
          <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No content found. Try adjusting your search or filters.</p>
        </div>
      )}
    </section>
  );
};

export default ContentLibrary;

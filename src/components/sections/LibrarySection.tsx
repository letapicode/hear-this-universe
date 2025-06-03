
import EnhancedContentCard from "@/components/EnhancedContentCard";
import { Search, Filter, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface LibrarySectionProps {
  filteredContent: any[];
  onPlay: (content: any) => void;
  currentlyPlaying: any;
}

const LibrarySection = ({ filteredContent, onPlay, currentlyPlaying }: LibrarySectionProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <section className="huly-section">
      <div className="huly-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="huly-text-3xl font-bold huly-gradient-text mb-2">
              Your Library
            </h2>
            <p className="text-muted-foreground huly-text-base">
              {filteredContent.length} audiobook{filteredContent.length !== 1 ? 's' : ''} available
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="huly-glass border-white/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <div className="flex items-center bg-white/5 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="w-8 h-8 p-0"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="w-8 h-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
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
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6' 
              : 'space-y-4'
            }
          `}>
            {filteredContent.map((content, index) => (
              <div
                key={content.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <EnhancedContentCard
                  content={{
                    ...content,
                    rating: 4.2 + Math.random() * 0.8,
                    progress: Math.random() > 0.7 ? Math.floor(Math.random() * 100) : undefined,
                    totalListeners: Math.floor(Math.random() * 50000) + 1000
                  }}
                  onPlay={onPlay}
                  currentlyPlaying={currentlyPlaying}
                  size={viewMode === 'grid' ? 'medium' : 'small'}
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

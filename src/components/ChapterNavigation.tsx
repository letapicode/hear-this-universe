
import { useEpisodeChapters } from "@/hooks/useChapters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { List, Play } from "lucide-react";

interface ChapterNavigationProps {
  episodeId: string;
  currentTime: number;
  onSeek: (time: number) => void;
}

const ChapterNavigation = ({ episodeId, currentTime, onSeek }: ChapterNavigationProps) => {
  const { data: chapters = [] } = useEpisodeChapters(episodeId);

  if (chapters.length === 0) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentChapter = () => {
    return chapters.find(chapter => 
      currentTime >= chapter.start_time && currentTime <= chapter.end_time
    );
  };

  const currentChapter = getCurrentChapter();

  return (
    <Card className="glass-morphism border-white/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center">
          <List className="h-4 w-4 mr-2" />
          Chapters ({chapters.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-40">
          <div className="space-y-1">
            {chapters.map((chapter) => {
              const isActive = currentChapter?.id === chapter.id;
              const isPassed = currentTime > chapter.end_time;
              
              return (
                <div
                  key={chapter.id}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                    isActive 
                      ? 'bg-purple-500/20 border border-purple-400/30' 
                      : isPassed 
                        ? 'bg-white/5 hover:bg-white/10' 
                        : 'hover:bg-white/10'
                  }`}
                  onClick={() => onSeek(chapter.start_time)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        isActive ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300'
                      }`}>
                        {chapter.chapter_number}
                      </span>
                      <span className={`text-sm truncate ${
                        isActive ? 'text-purple-300 font-medium' : 'text-gray-300'
                      }`}>
                        {chapter.title}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-2">
                    <span className="text-xs text-gray-400">
                      {formatTime(chapter.start_time)}
                    </span>
                    {!isActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSeek(chapter.start_time);
                        }}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ChapterNavigation;

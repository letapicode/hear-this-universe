
import { useState } from "react";
import { Bookmark, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface BookmarkData {
  time: number;
  note?: string;
}

interface BookmarkManagerProps {
  bookmarks: BookmarkData[];
  currentTime: number;
  duration: number;
  onAddBookmark: (bookmark: BookmarkData) => void;
  onRemoveBookmark: (time: number) => void;
  onJumpToBookmark: (time: number) => void;
}

const BookmarkManager = ({ 
  bookmarks, 
  currentTime, 
  duration, 
  onAddBookmark, 
  onRemoveBookmark, 
  onJumpToBookmark 
}: BookmarkManagerProps) => {
  const [newNote, setNewNote] = useState("");
  const { toast } = useToast();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addBookmarkWithNote = () => {
    const existingBookmark = bookmarks.find(b => Math.abs(b.time - currentTime) < 5);
    if (existingBookmark) {
      toast({
        title: "Bookmark exists",
        description: "A bookmark already exists near this time",
      });
      return;
    }

    onAddBookmark({ time: currentTime, note: newNote });
    setNewNote("");
    toast({
      title: "Bookmark Added",
      description: `Added at ${formatTime(currentTime)}`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Add bookmark section */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Add a note (optional)"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
          <Button
            onClick={addBookmarkWithNote}
            className="luxury-gradient"
            size="sm"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bookmarks list */}
      {bookmarks.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          <h5 className="text-sm font-medium text-gray-300">Bookmarks ({bookmarks.length})</h5>
          {bookmarks.map((bookmark, index) => (
            <div
              key={index}
              className="flex items-center justify-between glass-morphism rounded-lg p-3"
            >
              <div className="flex-1">
                <button
                  onClick={() => onJumpToBookmark(bookmark.time)}
                  className="text-left"
                >
                  <div className="text-sm text-yellow-400 font-medium">
                    {formatTime(bookmark.time)}
                  </div>
                  {bookmark.note && (
                    <div className="text-xs text-gray-300 mt-1">
                      {bookmark.note}
                    </div>
                  )}
                </button>
              </div>
              <Button
                onClick={() => onRemoveBookmark(bookmark.time)}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-red-400 ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Progress bar bookmarks */}
      <div className="relative h-1 bg-white/10 rounded-full">
        {bookmarks.map((bookmark, index) => (
          <div
            key={index}
            className="absolute top-1/2 w-2 h-2 bg-yellow-400 rounded-full -translate-y-1/2 -translate-x-1 cursor-pointer hover:scale-125 transition-transform"
            style={{ left: `${(bookmark.time / duration) * 100}%` }}
            onClick={() => onJumpToBookmark(bookmark.time)}
            title={bookmark.note || formatTime(bookmark.time)}
          />
        ))}
      </div>
    </div>
  );
};

export default BookmarkManager;

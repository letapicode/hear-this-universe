
import { useState } from "react";
import { Bookmark, X, Plus } from "lucide-react";
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
  const [showAddForm, setShowAddForm] = useState(false);
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
    setShowAddForm(false);
    toast({
      title: "Bookmark Added",
      description: `Added at ${formatTime(currentTime)}`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Add bookmark section */}
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-white/90">
          Bookmarks {bookmarks.length > 0 && `(${bookmarks.length})`}
        </h5>
        
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="huly-gradient text-white border-0 hover:scale-105 transition-all duration-200"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Bookmark
        </Button>
      </div>

      {showAddForm && (
        <div className="huly-glass rounded-lg p-4 space-y-3">
          <div className="flex items-center text-sm text-white/70">
            <Bookmark className="h-4 w-4 mr-2" />
            Adding bookmark at {formatTime(currentTime)}
          </div>
          <Input
            placeholder="Add a note (optional)"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="huly-input text-white placeholder:text-white/50"
            onKeyPress={(e) => e.key === 'Enter' && addBookmarkWithNote()}
          />
          <div className="flex gap-2">
            <Button
              onClick={addBookmarkWithNote}
              className="huly-gradient text-white border-0 flex-1"
              size="sm"
            >
              Save Bookmark
            </Button>
            <Button
              onClick={() => setShowAddForm(false)}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Progress bar bookmarks */}
      {bookmarks.length > 0 && (
        <div className="relative h-2 bg-white/10 rounded-full">
          {bookmarks.map((bookmark, index) => (
            <div
              key={index}
              className="absolute top-1/2 w-3 h-3 bg-yellow-400 rounded-full -translate-y-1/2 -translate-x-1.5 cursor-pointer hover:scale-125 transition-transform huly-shadow"
              style={{ left: `${(bookmark.time / duration) * 100}%` }}
              onClick={() => onJumpToBookmark(bookmark.time)}
              title={bookmark.note || formatTime(bookmark.time)}
            />
          ))}
        </div>
      )}

      {/* Bookmarks list */}
      {bookmarks.length > 0 && (
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {bookmarks.map((bookmark, index) => (
            <div
              key={index}
              className="huly-glass rounded-lg p-3 hover:bg-white/5 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onJumpToBookmark(bookmark.time)}
                  className="flex-1 text-left hover:text-white/90 transition-colors"
                >
                  <div className="text-sm text-yellow-400 font-medium">
                    {formatTime(bookmark.time)}
                  </div>
                  {bookmark.note && (
                    <div className="text-xs text-white/70 mt-1">
                      {bookmark.note}
                    </div>
                  )}
                </button>
                <Button
                  onClick={() => onRemoveBookmark(bookmark.time)}
                  variant="ghost"
                  size="sm"
                  className="text-white/50 hover:text-red-400 hover:bg-red-500/10 ml-2 w-8 h-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkManager;

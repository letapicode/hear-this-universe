
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Bookmark, BookmarkPlus, Brain, Clock, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SmartBookmark {
  id: string;
  timestamp: number;
  title: string;
  aiReason: string;
  userNote?: string;
  type: 'key_moment' | 'user_created' | 'ai_suggested';
}

interface SmartBookmarksProps {
  currentContent?: any;
  currentTime: number;
  onSeekTo: (time: number) => void;
}

const SmartBookmarks = ({ currentContent, currentTime, onSeekTo }: SmartBookmarksProps) => {
  const [newNote, setNewNote] = useState("");
  const queryClient = useQueryClient();

  // Mock AI-detected key moments for demo
  const mockKeyMoments: SmartBookmark[] = [
    {
      id: '1',
      timestamp: 120,
      title: 'Key Concept Introduction',
      aiReason: 'Important foundational concept introduced here',
      type: 'key_moment'
    },
    {
      id: '2',
      timestamp: 360,
      title: 'Practical Example',
      aiReason: 'Real-world example that illustrates the main point',
      type: 'key_moment'
    },
    {
      id: '3',
      timestamp: 720,
      title: 'Expert Quote',
      aiReason: 'Notable quote from industry expert',
      type: 'key_moment'
    }
  ];

  const { data: userBookmarks = [] } = useQuery({
    queryKey: ['bookmarks', currentContent?.id],
    queryFn: async () => {
      if (!currentContent?.id) return [];
      
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('episode_id', currentContent.id)
        .order('timestamp_seconds');

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentContent?.id
  });

  const createBookmark = useMutation({
    mutationFn: async ({ timestamp, note }: { timestamp: number; note?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
          episode_id: currentContent?.id,
          timestamp_seconds: Math.floor(timestamp),
          note: note || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success("Bookmark created!");
      setNewNote("");
    },
    onError: () => {
      toast.error("Failed to create bookmark");
    }
  });

  const deleteBookmark = useMutation({
    mutationFn: async (bookmarkId: string) => {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success("Bookmark deleted!");
    }
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateBookmark = () => {
    createBookmark.mutate({ 
      timestamp: currentTime, 
      note: newNote.trim() || undefined 
    });
  };

  const allBookmarks = [
    ...mockKeyMoments.map(km => ({
      ...km,
      isAI: true,
      timestamp_seconds: km.timestamp,
      note: km.aiReason
    })),
    ...userBookmarks.map(ub => ({
      ...ub,
      isAI: false,
      title: 'Personal Bookmark',
      type: 'user_created' as const
    }))
  ].sort((a, b) => a.timestamp_seconds - b.timestamp_seconds);

  if (!currentContent) {
    return (
      <Card className="huly-glass border-white/10">
        <CardContent className="p-6 text-center">
          <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Start playing content to see smart bookmarks</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="huly-glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 huly-gradient-text">
          <Brain className="h-5 w-5" />
          Smart Bookmarks
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          AI-detected key moments and your personal bookmarks
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Create Bookmark Section */}
        <div className="space-y-3 p-4 huly-glass border-white/5 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            Current time: {formatTime(Math.floor(currentTime))}
          </div>
          
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note for this bookmark (optional)..."
            className="huly-glass border-white/20 text-foreground resize-none"
            rows={2}
          />
          
          <Button
            onClick={handleCreateBookmark}
            disabled={createBookmark.isPending}
            className="w-full huly-gradient text-white border-0"
          >
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Create Bookmark
          </Button>
        </div>

        {/* Bookmarks List */}
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {allBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="p-3 huly-glass border-white/5 rounded-lg hover:huly-shadow-hover transition-all duration-300 cursor-pointer"
                onClick={() => onSeekTo(bookmark.timestamp_seconds)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary">
                      {formatTime(bookmark.timestamp_seconds)}
                    </span>
                    <Badge 
                      variant={bookmark.isAI ? "default" : "secondary"}
                      className={bookmark.isAI ? "huly-gradient text-white border-0" : ""}
                    >
                      {bookmark.isAI ? 'AI' : 'You'}
                    </Badge>
                  </div>
                  
                  {!bookmark.isAI && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBookmark.mutate(bookmark.id);
                      }}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {bookmark.title}
                </h4>
                
                {bookmark.note && (
                  <p className="text-xs text-muted-foreground">
                    {bookmark.note}
                  </p>
                )}
              </div>
            ))}
            
            {allBookmarks.length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No bookmarks yet. Create your first one!
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SmartBookmarks;

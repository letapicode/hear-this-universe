
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface PlaylistItem {
  id: string;
  title: string;
  author: string;
  image: string;
  duration?: number;
}

export const usePlaylist = () => {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const { toast } = useToast();

  const addToPlaylist = useCallback((item: PlaylistItem) => {
    setPlaylist(prev => {
      if (prev.find(p => p.id === item.id)) {
        toast({
          title: "Already in playlist",
          description: `${item.title} is already in your playlist`,
        });
        return prev;
      }
      toast({
        title: "Added to playlist",
        description: `${item.title} added to playlist`,
      });
      return [...prev, item];
    });
  }, [toast]);

  const removeFromPlaylist = useCallback((id: string) => {
    setPlaylist(prev => {
      const newPlaylist = prev.filter(item => item.id !== id);
      if (currentIndex >= newPlaylist.length) {
        setCurrentIndex(Math.max(0, newPlaylist.length - 1));
      }
      return newPlaylist;
    });
  }, [currentIndex]);

  const playNext = useCallback(() => {
    if (playlist.length === 0) return null;
    
    let nextIndex = currentIndex + 1;
    if (nextIndex >= playlist.length) {
      nextIndex = isRepeat ? 0 : currentIndex;
    }
    
    if (nextIndex !== currentIndex) {
      setCurrentIndex(nextIndex);
      return playlist[nextIndex];
    }
    return null;
  }, [playlist, currentIndex, isRepeat]);

  const playPrevious = useCallback(() => {
    if (playlist.length === 0) return null;
    
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = isRepeat ? playlist.length - 1 : 0;
    }
    
    setCurrentIndex(prevIndex);
    return playlist[prevIndex];
  }, [playlist, currentIndex, isRepeat]);

  const playItem = useCallback((index: number) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentIndex(index);
      return playlist[index];
    }
    return null;
  }, [playlist]);

  const clearPlaylist = useCallback(() => {
    setPlaylist([]);
    setCurrentIndex(0);
  }, []);

  const shufflePlaylist = useCallback(() => {
    if (playlist.length <= 1) return;
    
    const currentItem = playlist[currentIndex];
    const shuffled = [...playlist].sort(() => Math.random() - 0.5);
    const newCurrentIndex = shuffled.findIndex(item => item.id === currentItem.id);
    
    setPlaylist(shuffled);
    setCurrentIndex(newCurrentIndex);
    setIsShuffled(true);
    
    toast({
      title: "Playlist shuffled",
      description: "Your playlist has been shuffled",
    });
  }, [playlist, currentIndex, toast]);

  return {
    playlist,
    currentIndex,
    currentItem: playlist[currentIndex],
    isShuffled,
    isRepeat,
    addToPlaylist,
    removeFromPlaylist,
    playNext,
    playPrevious,
    playItem,
    clearPlaylist,
    shufflePlaylist,
    setIsRepeat,
    setIsShuffled
  };
};

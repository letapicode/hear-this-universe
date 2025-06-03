
import { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface AudioState {
  currentContent: any | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackSpeed: number;
  isLoading: boolean;
  error: string | null;
}

export const useAudioPlayer = () => {
  const [state, setState] = useState<AudioState>({
    currentContent: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 80,
    playbackSpeed: 1,
    isLoading: false,
    error: null
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Load saved state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('audioPlayerState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(prev => ({ ...prev, ...parsed, isPlaying: false }));
      } catch (error) {
        console.error('Failed to load audio state:', error);
      }
    }
  }, []);

  // Save state to localStorage
  const saveState = useCallback((newState: Partial<AudioState>) => {
    const stateToSave = {
      currentContent: newState.currentContent,
      currentTime: newState.currentTime,
      duration: newState.duration,
      volume: newState.volume,
      playbackSpeed: newState.playbackSpeed
    };
    localStorage.setItem('audioPlayerState', JSON.stringify(stateToSave));
  }, []);

  // Update state and save
  const updateState = useCallback((updates: Partial<AudioState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      saveState(newState);
      return newState;
    });
  }, [saveState]);

  const playContent = useCallback((content: any) => {
    updateState({ 
      currentContent: content, 
      isPlaying: true,
      isLoading: true,
      error: null
    });
    
    // Simulate loading time
    setTimeout(() => {
      updateState({ isLoading: false });
      toast({
        title: "Now Playing",
        description: `${content.title} by ${content.author}`,
      });
    }, 1000);
  }, [updateState, toast]);

  const togglePlayPause = useCallback(() => {
    updateState({ isPlaying: !state.isPlaying });
  }, [state.isPlaying, updateState]);

  const seekTo = useCallback((time: number) => {
    updateState({ currentTime: time });
  }, [updateState]);

  const setVolume = useCallback((volume: number) => {
    updateState({ volume });
  }, [updateState]);

  const setPlaybackSpeed = useCallback((speed: number) => {
    updateState({ playbackSpeed: speed });
    toast({
      title: "Playback Speed",
      description: `Set to ${speed}x`,
    });
  }, [updateState, toast]);

  const skipForward = useCallback((seconds: number = 15) => {
    const newTime = Math.min(state.currentTime + seconds, state.duration);
    updateState({ currentTime: newTime });
  }, [state.currentTime, state.duration, updateState]);

  const skipBackward = useCallback((seconds: number = 15) => {
    const newTime = Math.max(state.currentTime - seconds, 0);
    updateState({ currentTime: newTime });
  }, [state.currentTime, updateState]);

  const closePlayer = useCallback(() => {
    updateState({ 
      currentContent: null, 
      isPlaying: false,
      currentTime: 0,
      error: null
    });
  }, [updateState]);

  return {
    ...state,
    playContent,
    togglePlayPause,
    seekTo,
    setVolume,
    setPlaybackSpeed,
    skipForward,
    skipBackward,
    closePlayer,
    audioRef
  };
};

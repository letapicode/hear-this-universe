
import { useEffect } from "react";

interface KeyboardShortcutsProps {
  onPlayPause: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onSeekForward: () => void;
  onSeekBackward: () => void;
  isPlayerActive: boolean;
}

export const useKeyboardShortcuts = ({
  onPlayPause,
  onSkipForward,
  onSkipBackward,
  onVolumeUp,
  onVolumeDown,
  onSeekForward,
  onSeekBackward,
  isPlayerActive
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    if (!isPlayerActive) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input field
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Prevent default behavior for our shortcuts
      const shortcuts = [' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'j', 'l', 'k'];
      if (shortcuts.includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case ' ': // Spacebar
          onPlayPause();
          break;
        case 'ArrowLeft':
          onSeekBackward();
          break;
        case 'ArrowRight':
          onSeekForward();
          break;
        case 'ArrowUp':
          onVolumeUp();
          break;
        case 'ArrowDown':
          onVolumeDown();
          break;
        case 'j':
          onSkipBackward();
          break;
        case 'l':
          onSkipForward();
          break;
        case 'k':
          onPlayPause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    isPlayerActive,
    onPlayPause,
    onSkipForward,
    onSkipBackward,
    onVolumeUp,
    onVolumeDown,
    onSeekForward,
    onSeekBackward
  ]);
};


import AudioPlayer from "@/components/AudioPlayer";
import ChapterNavigation from "@/components/ChapterNavigation";
import MiniPlayer from "@/components/MiniPlayer";

interface PlayerManagerProps {
  currentContent: any;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isMinimized: boolean;
  showChapters: boolean;
  audioPlayer: any;
  listeningHistory: any;
  onMinimize: (minimized: boolean) => void;
}

const PlayerManager = ({
  currentContent,
  isPlaying,
  currentTime,
  duration,
  isMinimized,
  showChapters,
  audioPlayer,
  listeningHistory,
  onMinimize
}: PlayerManagerProps) => {
  if (!currentContent) return null;

  return (
    <>
      {isMinimized ? (
        <MiniPlayer
          content={currentContent}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={audioPlayer.togglePlayPause}
          onSkipForward={() => audioPlayer.skipForward(15)}
          onSkipBackward={() => audioPlayer.skipBackward(15)}
          onMaximize={() => onMinimize(false)}
        />
      ) : (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="flex">
            <div className="flex-1">
              <AudioPlayer 
                content={currentContent}
                isPlaying={isPlaying}
                onPlayPause={audioPlayer.togglePlayPause}
                onClose={() => {
                  audioPlayer.closePlayer();
                  if (listeningHistory.currentSession) {
                    listeningHistory.endSession();
                  }
                }}
              />
            </div>
            
            {showChapters && (
              <div className="w-80 bg-black/95 backdrop-blur-xl border-l border-white/10">
                <ChapterNavigation
                  episodeId={currentContent.id}
                  currentTime={currentTime}
                  onSeek={audioPlayer.seekTo}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerManager;

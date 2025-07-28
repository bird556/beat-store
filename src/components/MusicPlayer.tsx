import { usePlayer } from '@/contexts/PlayerContext';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEffect } from 'react';
const MusicPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    queue,
    playTrack,
    nextTrack,
    previousTrack,
  } = usePlayer();
  const getNextTrack = () => {
    if (queue.length === 0) return null;
    if (!currentTrack) return queue[0];
    const currentIndex = queue.findIndex(
      (track) => track.id === currentTrack.id
    );
    const nextIndex = (currentIndex + 1) % queue.length;
    return queue[nextIndex];
  };

  const nextTrackInfo = getNextTrack();
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: 'Birdie Bands',
        artwork: [
          {
            src: currentTrack.image || currentTrack.s3_image_url,
            sizes: '512x512',
            type: 'image/jpeg',
          },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => togglePlay());
      navigator.mediaSession.setActionHandler('previoustrack', () =>
        previousTrack()
      );
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
    }
  }, [currentTrack]);
  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-gray-800 px-4 py-3 z-[500] w-full">
      <div className="xl:w-7xl mx-auto z-50">
        <div className="flex items-center justify-between text-start ">
          {/* Current Track Info */}
          <div className="flex items-center gap-4 min-w-0 relative">
            <img
              src={currentTrack.image || currentTrack.s3_image_url}
              alt={currentTrack.title}
              className="rounded h-14 w-14 object-cover hidden sm:block"
            />
            <div className="min-w-0 flex-1">
              <div className=" sm:block text-white font-medium truncate md:max-w-64 ">
                {currentTrack.title}
              </div>
              <div className=" sm:block text-gray-400 text-sm truncate">
                {currentTrack.artist} Type Beat
              </div>
              <div className=" sm:block text-gray-500 text-xs">
                Key: {currentTrack.key} | {currentTrack.bpm} BPM
              </div>
            </div>
          </div>

          {/* Audio Player */}
          <div className="flex-1 max-w-6xl mx-4">
            <AudioPlayer
              // autoPlay={isPlaying}
              autoPlay={true}
              src={currentTrack.audioUrl || currentTrack.s3_mp3_url}
              onPlay={togglePlay}
              onPause={togglePlay}
              onClickNext={nextTrack}
              onClickPrevious={previousTrack}
              onEnded={nextTrack}
              progressUpdateInterval={100}
              showJumpControls={true}
              showSkipControls={true}
              // customProgressBarSection={[]}
              progressJumpSteps={{
                forward: 10000,
                backward: 5000,
              }}
            />
          </div>

          {/* Player Controls */}

          {/* Volume and Next Up */}
          {nextTrackInfo && (
            <div className="flex items-center justify-center flex-col">
              {/* Next Up */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playTrack(nextTrackInfo);
                    }}
                    className="relative bg-zinc-900 overflow-hidden !p-0 min-w-full hover:!border-transparent cursor-pointer hidden lg:flex items-center space-x-2  hover:!bg-green-400/50 rounded-lg "
                  >
                    <img
                      src={nextTrackInfo.image || nextTrackInfo.s3_image_url}
                      alt={nextTrackInfo.artist}
                      className="rounded min-w-12 w-12 object-cover aspect-square"
                    />
                    <div className="min-w-0 w-full px-2">
                      <div className="text-xs text-gray-400">Next Up</div>
                      <div className="text-sm text-white truncate min-w-32 max-w-32">
                        {nextTrackInfo.title}
                      </div>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Play Next Track</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;

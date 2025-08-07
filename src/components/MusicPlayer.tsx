// src/components/musicplayer.tsx
import { usePlayer } from '@/contexts/PlayerContext';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ShoppingCart } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LicenseModal from './license-modal';
import { useCart } from '@/contexts/cart-context';

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
  const { items: cartItems } = useCart();
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const navigate = useNavigate();

  const audioPlayerRef = useRef<any>(null);

  // Sync the play/pause state with the audio element
  useEffect(() => {
    if (!audioPlayerRef.current) return;

    if (isPlaying) {
      audioPlayerRef.current.audio.current
        .play()
        .catch((e) => console.error('Play failed:', e));
    } else {
      audioPlayerRef.current.audio.current.pause();
    }
  }, [isPlaying, currentTrack?.id]); // Re-run when isPlaying or track changes

  // Update the media session
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;

    try {
      // Set media metadata
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title || 'Unknown Track',
        artist: `${currentTrack.artist || 'Unknown Artist'} Type Beat`,
        album: 'Birdie Bands',
        artwork: [
          {
            src:
              currentTrack.image ||
              currentTrack.s3_image_url ||
              '/default-album-art.jpg',
            sizes: '96x96',
            type: 'image/jpeg',
          },
          {
            src:
              currentTrack.image ||
              currentTrack.s3_image_url ||
              '/default-album-art.jpg',
            sizes: '128x128',
            type: 'image/jpeg',
          },
          {
            src:
              currentTrack.image ||
              currentTrack.s3_image_url ||
              '/default-album-art.jpg',
            sizes: '192x192',
            type: 'image/jpeg',
          },
          {
            src:
              currentTrack.image ||
              currentTrack.s3_image_url ||
              '/default-album-art.jpg',
            sizes: '256x256',
            type: 'image/jpeg',
          },
          {
            src:
              currentTrack.image ||
              currentTrack.s3_image_url ||
              '/default-album-art.jpg',
            sizes: '384x384',
            type: 'image/jpeg',
          },
          {
            src:
              currentTrack.image ||
              currentTrack.s3_image_url ||
              '/default-album-art.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
          },
        ],
      });

      // Update playback state
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      // Set action handlers with fallbacks
      try {
        navigator.mediaSession.setActionHandler('play', () => {
          if (!isPlaying) togglePlay();
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          if (isPlaying) togglePlay();
        });
      } catch (error) {
        console.log('Play/pause actions not supported');
      }

      try {
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          previousTrack();
        });
      } catch (error) {
        console.log('Previous track action not supported');
      }

      try {
        navigator.mediaSession.setActionHandler('nexttrack', () => {
          nextTrack();
        });
      } catch (error) {
        console.log('Next track action not supported');
      }

      // Additional optional handlers
      try {
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (audioPlayerRef.current) {
            audioPlayerRef.current.audio.current.currentTime = details.seekTime;
          }
        });
      } catch (error) {
        console.log('Seek action not supported');
      }
    } catch (error) {
      console.error('Media Session API error:', error);
    }

    // Cleanup function
    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null;
        try {
          navigator.mediaSession.setActionHandler('play', null);
          navigator.mediaSession.setActionHandler('pause', null);
          navigator.mediaSession.setActionHandler('previoustrack', null);
          navigator.mediaSession.setActionHandler('nexttrack', null);
          navigator.mediaSession.setActionHandler('seekto', null);
        } catch (error) {
          console.log('Error cleaning up media session handlers');
        }
      }
    };
  }, [currentTrack, isPlaying]); // Add isPlaying to dependencies

  const getNextTrack = () => {
    if (queue.length === 0) return null;
    if (!currentTrack) return queue[0];
    const currentIndex = queue.findIndex(
      (track) => track.id === currentTrack.id
    );
    const nextIndex = (currentIndex + 1) % queue.length;
    return queue[nextIndex];
  };

  const handleCardClick = (beat: Track) => {
    // Re-fetch the main beat when a related beat is clicked to update the page
    navigate(`/beat?beatId=${beat._id}`);
    // Consider adding a scroll to top here for a better UX
    window.scrollTo(0, 0);
  };

  const handleBuyClick = (track: Track) => {
    // console.log(track, 'handle buy click');
    setSelectedTrack(track);
    setIsLicenseModalOpen(true);
  };

  const isTrackInCart = (trackId: string) => {
    return cartItems.some((item) => item.id === trackId);
  };
  const handleEditLicenseClick = (track: Track) => {
    setSelectedTrack(track);
    setIsLicenseModalOpen(true);
  };

  const nextTrackInfo = getNextTrack();
  if (!currentTrack) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-3 z-[500] w-full">
      <div className="xl:w-7xl mx-auto z-50">
        <div className="flex items-center justify-between text-start ">
          {/* Current Track Info */}
          <div className="flex items-center gap-4 min-w-0 relative">
            <img
              src={currentTrack.image || currentTrack.s3_image_url}
              alt={currentTrack.title}
              className="rounded h-14 w-14 object-cover hidden sm:block"
            />
            <button
              onClick={() => handleCardClick(currentTrack)}
              className="!p-0 !m-0 text-start overflow-hidden"
            >
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
            </button>
          </div>

          {/* Audio Player */}
          <div className="flex-1 max-w-6xl mx-4">
            <AudioPlayer
              // autoPlay={true}
              ref={audioPlayerRef}
              autoPlay={false} // We'll control this manually
              src={currentTrack.audioUrl || currentTrack.s3_mp3_url}
              onPlay={() => {
                // Only update context if not already playing
                if (!isPlaying) togglePlay();
              }}
              onPause={() => {
                // Only update context if not already paused
                if (isPlaying) togglePlay();
              }}
              onClickNext={nextTrack}
              onClickPrevious={previousTrack}
              onEnded={nextTrack}
              progressUpdateInterval={100}
              showJumpControls={true}
              showSkipControls={true}
              progressJumpSteps={{
                forward: 10000,
                backward: 5000,
              }}
            />
          </div>

          {/* Player Controls */}

          {/* Volume and Next Up */}
          {/* {nextTrackInfo && (
            <div className="flex items-center justify-center flex-col">
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
                      className="rounded h-12 min-w-12 object-cover"
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
          )} */}

          {isTrackInCart(currentTrack.id) ? (
            <button
              onClick={() => handleEditLicenseClick(currentTrack)}
              className="!bg-green-600 hover:!bg-green-800 !transition-colors duration-300 text-foreground px-4 py-2 rounded font-medium text-sm lg:min-w-28"
            >
              <ShoppingCart className="w-4 h-4 min-md:hidden" />
              <span className="hidden md:block">IN CART</span>
            </button>
          ) : (
            <button
              onClick={() => handleBuyClick(currentTrack)}
              className="lg:min-w-28 cursor-pointer !bg-foreground  text-background px-4 py-2 rounded font-medium text-sm hover:!bg-gray-300 transition-colors flex items-center space-x-1"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:block">
                ${currentTrack.price || currentTrack.licenses[0].price}
              </span>
            </button>
          )}
        </div>
      </div>
      <LicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
        track={selectedTrack}
      />
    </div>
  );
};

export default MusicPlayer;

import React from 'react';
import { useState, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
} from 'lucide-react';
import Particles from './ui/ReactBits/Particles';
import { usePlayer } from '@/contexts/PlayerContext';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const MusicPlayer = () => {
  //   const [isMuted, setIsMuted] = useState(false);
  //   const [previousVolume, setPreviousVolume] = useState(volume);
  //   const audioRef = useRef<HTMLAudioElement>(null);
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
  if (!currentTrack) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-gray-800 px-4 py-3 z-[500] w-full">
      {/* <div className="absolute h-full w-full top-0 left-0 z-0">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={50000}
          particleSpread={70}
          speed={0.1}
          particleBaseSize={10}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation={true}
        />
      </div> */}

      <div className="xl:w-7xl mx-auto z-50">
        <div className="flex items-center justify-between text-start ">
          {/* Current Track Info */}
          <div className="flex items-center gap-4 min-w-0">
            <img
              src={currentTrack.image}
              alt={currentTrack.title}
              className="rounded h-14 w-14 hidden sm:block"
            />
            <div className="min-w-0 flex-1">
              <div className=" sm:block text-white font-medium truncate md:max-w-64 ">
                {currentTrack.title}
              </div>
              <div className=" sm:block text-gray-400 text-sm truncate">
                {currentTrack.artist}
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
              src={currentTrack.audioUrl}
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
                      src={nextTrackInfo.image}
                      alt={nextTrackInfo.artist}
                      className="rounded h-12 min-w-12"
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

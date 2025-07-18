// src/contexts/PlayerContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  dateAdded: string;
  duration: string;
  price: number;
  image: string;
  audioUrl: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setQueue: (tracks: Track[]) => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

const PlayerContext = createContext<PlayerContextType>({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  playTrack: () => {},
  togglePlay: () => {},
  setQueue: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
});

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);

  // Auto-load first track when queue is set
  useEffect(() => {
    if (queue.length > 0 && !currentTrack) {
      const firstTrack = queue[0];
      setCurrentTrack(firstTrack);
    }
  }, [queue, currentTrack]);

  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSetQueue = (tracks: Track[]) => {
    setQueue(tracks);
  };

  const nextTrack = () => {
    if (!currentTrack || queue.length === 0) return;

    const currentIndex = queue.findIndex(
      (track) => track.id === currentTrack.id
    );
    let nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) {
      nextIndex = 0;
    }

    playTrack(queue[nextIndex]);
  };

  const previousTrack = () => {
    if (!currentTrack || queue.length === 0) return;

    const currentIndex = queue.findIndex(
      (track) => track.id === currentTrack.id
    );

    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    playTrack(queue[prevIndex]);
  };
  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        queue,
        playTrack,
        togglePlay,
        setQueue: handleSetQueue,
        nextTrack,
        previousTrack,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);

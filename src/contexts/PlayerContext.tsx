// src/contexts/PlayerContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Track } from '../types';
// export interface Track {
//   id: string;
//   title: string;
//   artist: string;
//   bpm: number;
//   key: string;
//   dateAdded: string;
//   duration: string;
//   price: number;
//   image: string;
//   audioUrl: string;
//   licenses: object[];
//   s3_mp3_url: string;
//   s3_image_url: string;
// }

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  setQueue: (tracks: Track[]) => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const PlayerContext = createContext<PlayerContextType>({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  playTrack: () => {},
  pauseTrack: () => {},
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

      // --- GA4 Play/Pause Event Tracking ---
      if (window.gtag) {
        const eventName = isPlaying ? 'beat_pause' : 'beat_play';
        window.gtag('event', eventName, {
          beat_id: track.id.toString(),
          beat_name: track.title,
          artist_name: track.artist,
          content_type: track.type,
          send_to: 'G-K8ZTDYC2LD',
        });
      }
      // --- END GA4 Tracking ---
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      // --- GA4 Play Event Tracking (New Track) ---
      if (window.gtag) {
        window.gtag('event', 'beat_play', {
          beat_id: track.id.toString(),
          beat_name: track.title,
          artist_name: track.artist,
          content_type: track.type,
          send_to: 'G-K8ZTDYC2LD',
        });
      }
      // --- END GA4 Tracking ---
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    console.log('pause from pauseTrack Player Context');
    // --- GA4 Pause Event Tracking ---
    if (window.gtag && currentTrack) {
      window.gtag('event', 'beat_pause', {
        beat_id: currentTrack.id.toString(),
        beat_name: currentTrack.title,
        artist_name: currentTrack.artist,
        content_type: currentTrack.type,
        send_to: 'G-K8ZTDYC2LD',
      });
    }
    // --- END GA4 Tracking ---
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Get the state *before* it was flipped
    const wasPlaying = isPlaying;

    // --- GA4 Play/Pause Event Tracking ---
    if (window.gtag && currentTrack) {
      const eventName = wasPlaying ? 'beat_pause' : 'beat_play';

      window.gtag('event', eventName, {
        beat_id: currentTrack.id.toString(),
        beat_name: currentTrack.title,
        artist_name: currentTrack.artist,
        content_type: currentTrack.type,
        send_to: 'G-K8ZTDYC2LD',
      });
    }
    // --- END GA4 Tracking ---

    // if (isPlaying) {
    if (wasPlaying) {
      console.log('play');
    } else {
      console.log('pause');
    }
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

    // --- GA4 Event Tracking: User clicked Next ---
    if (window.gtag) {
      window.gtag('event', 'player_next', {
        previous_beat_id: currentTrack.id.toString(),
        next_beat_name: queue[nextIndex].title,
        next_artist_name: queue[nextIndex].artist,
        next_content_type: queue[nextIndex].type,
        send_to: 'G-K8ZTDYC2LD',
      });
    }
    // --- END GA4 Tracking ---

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

    // --- GA4 Event Tracking: User clicked Previous ---
    if (window.gtag) {
      window.gtag('event', 'player_previous', {
        previous_beat_id: currentTrack.id.toString(),
        next_beat_name: queue[prevIndex].title,
        next_artist_name: queue[prevIndex].artist,
        next_content_type: queue[prevIndex].type,
        send_to: 'G-K8ZTDYC2LD',
      });
    }
    // --- END GA4 Tracking ---

    playTrack(queue[prevIndex]);
  };
  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        queue,
        playTrack,
        pauseTrack,
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

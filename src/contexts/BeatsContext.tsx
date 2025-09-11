// src/contexts/BeatsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import axios from 'axios';
import type { Track } from '../types';

interface BeatsContextType {
  beats: Track[];
  isBeatsLoaded: boolean;
  fetchBeats: (page?: number, limit?: number, search?: string) => Promise<void>;
  totalBeats: number;
  totalPages: number;
  currentPage: number;
}

const BeatsContext = createContext<BeatsContextType | undefined>(undefined);

export const BeatsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [beats, setBeats] = useState<Track[]>([]);
  const [isBeatsLoaded, setIsBeatsLoaded] = useState(false);
  const [totalBeats, setTotalBeats] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const cache = useRef<
    Map<
      string,
      {
        beats: Track[];
        totalBeats: number;
        totalPages: number;
        currentPage: number;
        timestamp: number;
      }
    >
  >(new Map());
  const fetchBeats = useCallback(async (page = 1, limit = 6, search = '') => {
    const cacheKey = `${page}-${limit}-${search}`;
    const cachedData = cache.current.get(cacheKey);
    const cacheAge = cachedData ? Date.now() - cachedData.timestamp : Infinity;
    if (cachedData && cacheAge < 5 * 60 * 1000) {
      // Cache valid for 5 minutes
      setBeats(cachedData.beats);
      setTotalBeats(cachedData.totalBeats);
      setTotalPages(cachedData.totalPages);
      setCurrentPage(cachedData.currentPage);
      setIsBeatsLoaded(true);
      // console.log('Beats retrieved from cache:', cacheKey);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL_BACKEND}/api/beats`,
        {
          params: { page, limit, search },
        }
      );
      const tracks = response.data.beats.map((track: any) => ({
        ...track,
        id: track._id,
      }));
      setBeats(tracks);
      setTotalBeats(response.data.totalBeats);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page);
      setIsBeatsLoaded(true);
      cache.current.set(cacheKey, {
        beats: tracks,
        totalBeats: response.data.totalBeats,
        totalPages: response.data.totalPages,
        currentPage: response.data.page,
        timestamp: Date.now(),
      });
      // console.log('Beats fetched successfully:', cacheKey);
    } catch (error) {
      console.error('Error fetching beats:', error);
      // toast.error('Failed to load beats. Retrying...');
      setTimeout(() => fetchBeats(page, limit, search), 5000);
      setIsBeatsLoaded(false);
    }
  }, []); // Empty dependency array since fetchBeats doesn't depend on any external variables

  return (
    <BeatsContext.Provider
      value={{
        beats,
        isBeatsLoaded,
        fetchBeats,
        totalBeats,
        totalPages,
        currentPage,
      }}
    >
      {children}
    </BeatsContext.Provider>
  );
};

export const useBeats = () => {
  const context = useContext(BeatsContext);
  if (!context) {
    throw new Error('useBeats must be used within a BeatsProvider');
  }
  return context;
};

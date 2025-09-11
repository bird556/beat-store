import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import axios from 'axios';
import type { Pack } from '../types';

interface BeatPackContextType {
  packs: Pack[];
  isPacksLoaded: boolean;
  fetchPacks: (page?: number, limit?: number, search?: string) => Promise<void>;
  totalPacks: number;
  totalPages: number;
  currentPage: number;
}

const BeatPackContext = createContext<BeatPackContextType | undefined>(
  undefined
);

export const BeatPackProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [isPacksLoaded, setIsPacksLoaded] = useState(false);
  const [totalPacks, setTotalPacks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const cache = useRef<
    Map<
      string,
      {
        packs: Pack[];
        totalPacks: number;
        totalPages: number;
        currentPage: number;
        timestamp: number;
      }
    >
  >(new Map());

  const fetchPacks = useCallback(async (page = 1, limit = 6, search = '') => {
    const cacheKey = `${page}-${limit}-${search}`;
    const cachedData = cache.current.get(cacheKey);
    const cacheAge = cachedData ? Date.now() - cachedData.timestamp : Infinity;

    if (cachedData && cacheAge < 5 * 60 * 1000) {
      // Cache valid for 5 minutes
      setPacks(cachedData.packs);
      setTotalPacks(cachedData.totalPacks);
      setTotalPages(cachedData.totalPages);
      setCurrentPage(cachedData.currentPage);
      setIsPacksLoaded(true);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL_BACKEND}/api/packs`,
        {
          params: { page, limit, search },
        }
      );
      const packsData = response.data.packs.map((pack: any) => ({
        ...pack,
        id: pack._id,
      }));
      setPacks(packsData);
      setTotalPacks(response.data.totalPacks);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page);
      setIsPacksLoaded(true);
      cache.current.set(cacheKey, {
        packs: packsData,
        totalPacks: response.data.totalPacks,
        totalPages: response.data.totalPages,
        currentPage: response.data.page,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error fetching packs:', error);
      setTimeout(() => fetchPacks(page, limit, search), 5000);
      setIsPacksLoaded(false);
    }
  }, []);

  return (
    <BeatPackContext.Provider
      value={{
        packs,
        isPacksLoaded,
        fetchPacks,
        totalPacks,
        totalPages,
        currentPage,
      }}
    >
      {children}
    </BeatPackContext.Provider>
  );
};

export const useBeatPacks = () => {
  const context = useContext(BeatPackContext);
  if (!context) {
    throw new Error('useBeatPacks must be used within a BeatPackProvider');
  }
  return context;
};

// src/contexts/BeatsContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface License {
  type: string;
  price: number;
  currency: string;
  description: string;
  s3_file_url: string;
  features: string[];
}

interface Track {
  _id: string;
  id?: string; // Optional, as frontend maps _id to id
  title: string;
  artist: string;
  bpm: number;
  key: string;
  duration: string;
  tags: string[];
  s3_mp3_url: string;
  s3_image_url: string | null;
  created_at: Date | string;
  licenses: License[];
  available: boolean;
  price?: number; // Optional, as price might come from licenses[0].price
}

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

  const fetchBeats = async (page = 1, limit = 20, search = '') => {
    try {
      const response = await axios.get('http://localhost:3001/api/beats', {
        params: { page, limit, search },
      });
      const tracks = response.data.beats.map((track: any) => ({
        ...track,
        id: track._id, // Map _id to id for frontend compatibility
        bpm: parseFloat(track.bpm.$numberDouble || track.bpm), // Handle MongoDB $numberDouble
        created_at: new Date(track.created_at.$date.$numberLong), // Convert MongoDB date
        licenses: track.licenses.map((license: any) => ({
          ...license,
          price: parseFloat(license.price.$numberDouble || license.price), // Handle $numberDouble
        })),
      }));
      setBeats(tracks);
      setTotalBeats(response.data.totalBeats);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page);
      setIsBeatsLoaded(true);
    } catch (error) {
      console.error('Error fetching beats:', error);
      setTimeout(() => fetchBeats(page, limit, search), 5000);
      setIsBeatsLoaded(false);
    }
  };

  useEffect(() => {
    // Fetch initial beats for homepage (6 beats)
    fetchBeats(1, 6);
  }, []);

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

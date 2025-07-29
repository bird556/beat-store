'use client';
import React, { use } from 'react';
import { PlaceholdersAndVanishInput } from './ui/placeholders-and-vanish-input';
import { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  ShoppingCart,
  Download,
  Share2,
  Pause,
} from 'lucide-react';
import BirdieLogo from '/src/Images/logo.png';
import Particles from './ui/ReactBits/Particles';
import { Link, NavLink } from 'react-router';
import { usePlayer } from '@/contexts/PlayerContext';
import sampleTracks from '../../Data/MockData';
import StudioVideo from '/Videos/music-studio.mp4';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '@/contexts/cart-context';
import LicenseModal from './license-modal';
import axios from 'axios';
/**
 * A track listing component that displays a list of tracks and allows the user to search
 * through them. It also allows the user to play, download, and share tracks.
 * @param {object} props - The component props.
 * @prop {number} limitTrackCount - The number of tracks to display. If not provided, it will
 * display all tracks.
 * @prop {string} searchTerm - The search term to filter the tracks by.
 * @prop {function} setSearchTerm - A function to set the search term.
 */
const TrackListing = ({ limitTrackCount, searchTerm, setSearchTerm }) => {
  // const { playTrack, setQueue, currentTrack, isPlaying } = useMusic();
  const { items: cartItems } = useCart();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // const [filteredTracks, setFilteredTracks] = useState<Track[]>(sampleTracks);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const {
    playTrack,
    currentTrack,
    isPlaying,
    setQueue,
    queue,
    togglePlay,
    pauseTrack,
  } = usePlayer();
  const [fetchedBeats, setFetchedBeats] = useState<Track[]>([]);
  const [searchParams] = useSearchParams();
  const defaultQuery = searchParams.get('search') || '';

  const placeholders = [
    'Larry June Type Beat?',
    'Payroll Giovanni Type Beat?',
    'Playboi Carti Type Beat?',
    'Key Glock Type Beat?',
    'Drake Type Beat?',
    'Gunna Type Beat?',
    'G-Funk?',
  ];

  // const fetchBeats = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:3001/api/beats`);
  //     console.log(response.data.beats);
  //     setFilteredTracks(response.data.beats);
  //     setQueue(response.data.beats);
  //   } catch (error) {
  //     console.error('Error fetching beats:', error);
  //   }
  // };

  // const fetchBeats = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:3001/api/beats`);
  //     console.log(response.data.beats);
  //     setFetchedBeats(response.data.beats); // Store fetched beats separately
  //     // setFilteredTracks([...response.data.beats, ...sampleTracks]); // Combine fetched beats with sampleTracks
  //     setFilteredTracks(response.data.beats); // Combine fetched beats with sampleTracks
  //     // setQueue([...response.data.beats, ...sampleTracks]);
  //     setQueue(response.data.beats);
  //   } catch (error) {
  //     console.error('Error fetching beats:', error);
  //   }
  // };

  const fetchBeats = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/beats`);
      const tracks = response.data.beats.map((track) => ({
        ...track,
        id: track._id,
      }));
      setFetchedBeats(tracks);
      setFilteredTracks(tracks);
      setQueue(tracks);
    } catch (error) {
      console.error('Error fetching beats:', error);
    }
  };

  useEffect(() => {
    fetchBeats();
  }, []);

  // useEffect(() => {
  //   if (!searchQuery.trim()) {
  //     setFilteredTracks(sampleTracks);
  //   } else {
  //     const filtered = sampleTracks.filter(
  //       (track) =>
  //         track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //     setFilteredTracks(filtered);
  //   }
  // }, [searchQuery]);
  // Search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      // If no search query, show all tracks (fetched beats first, then sampleTracks)
      // setFilteredTracks([...fetchedBeats, ...sampleTracks]);
      setFilteredTracks([...fetchedBeats]);
      // setQueue([...fetchedBeats, ...sampleTracks]);
      setQueue([...fetchedBeats]);
    } else {
      // Search through both fetched beats and sampleTracks
      // const allTracks = [...fetchedBeats, ...sampleTracks];
      const allTracks = [...fetchedBeats];
      const filtered = allTracks.filter(
        (track) =>
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTracks(filtered);
      setQueue(filtered);
    }
  }, [searchQuery, fetchedBeats]); // Add fetchedBeats as dependency

  // useEffect(() => {
  //   // setQueue(sampleTracks);
  //   if (!searchQuery.trim()) {
  //     setQueue(sampleTracks);
  //   } else {
  //     const filtered = sampleTracks.filter(
  //       (track) =>
  //         track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //     setQueue(filtered);
  //   }
  // }, [searchQuery]);

  useEffect(() => {
    if (defaultQuery) {
      const filtered = fetchedBeats.filter(
        (track) =>
          track.title.toLowerCase().includes(defaultQuery.toLowerCase()) ||
          track.artist.toLowerCase().includes(defaultQuery.toLowerCase())
      );
      setFilteredTracks(filtered);
      setQueue(filtered);
    }
  }, [defaultQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitted');
  };

  /**
   * Handles the download button click. For demo purposes, this shows an alert, but
   * in production this would trigger a download of the track.
   * @param {Track} track The track to download
   */
  const handleDownloadClick = (track: Track) => {
    // For demo purposes, show an alert. In production, this would trigger a download
    alert(
      `Download ${track.title} - This would trigger a download in production`
    );
  };

  const handleShareClick = (track: Track) => {
    // For demo purposes, copy to clipboard. In production, this could open a share modal
    const shareText = `Check out this beat: ${track.title} by ${track.artist}`;
    if (navigator.share) {
      navigator
        .share({
          title: track.title,
          text: shareText,
          url: window.location.href,
        })
        .catch(() => {
          // Fallback to clipboard
          navigator.clipboard.writeText(shareText);
          alert('Share link copied to clipboard!');
        });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Share link copied to clipboard!');
    }
  };

  const handleBuyClick = (track: Track) => {
    // console.log(track, 'handle buy click');
    setSelectedTrack(track);
    setIsLicenseModalOpen(true);
  };

  const isTrackInCart = (trackId: string) => {
    return cartItems.some((item) => item.id === trackId);
  };

  const handleTrackPlay = (track: Track, e: React.MouseEvent) => {
    e.stopPropagation();

    // If this is the current track and it's playing, pause it
    if (currentTrack?.id === track.id && isPlaying) {
      pauseTrack();
      console.log('pause', isPlaying);
    }
    // If this is the current track but paused, resume playback
    else if (currentTrack?.id === track.id && !isPlaying) {
      playTrack(track);
    }
    // If it's a different track, play it
    else {
      playTrack(track);
    }
  };

  // framer motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Delay between items
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const TrackCard = ({ track }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false });
    return (
      <>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="z-50 grid grid-cols-10 gap-4 items-center py-3 px-2 rounded-lg hover:bg-foreground/15 transition-colors group"
        >
          {/* Title with Image */}
          <button
            // onClick={() => handlePlayTrack(track)}
            // onClick={(e) => {
            //   e.stopPropagation();
            //   // playTrack(track);
            //   togglePlay();
            // }}
            onClick={(e) => handleTrackPlay(track, e)}
            // className="col-span-5 md:col-span-4 flex items-center space-x-3 cursor-pointer"
            className="!bg-transparent !p-0 hover:!border-transparent z-50 !text-start col-span-5 md:col-span-4 flex items-center space-x-3 cursor-pointer"
          >
            <div className="relative aspect-square overflow-hidden rounded cursor-pointer">
              <img
                className="w-20 object-cover aspect-square"
                src={track.image ? track.image : track.s3_image_url}
                alt={track.title}
              />
              <div
                className={`cursor-pointer scale-125 absolute inset-0 !bg-black/50 !border-transparent flex items-center justify-center transition-opacity rounded ${
                  currentTrack?.id === track.id ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {currentTrack?.id === track.id && isPlaying ? (
                  <Pause className="w-4 h-4 text-foreground fill-white" />
                ) : (
                  <Play className="w-4 h-4 text-foreground fill-white" />
                )}
              </div>
            </div>
            <div className="min-w-0">
              {/* <div
                      className={`font-medium truncate ${
                        isCurrentTrack(track.id)
                          ? 'text-green-400'
                          : 'text-foreground'}
                          `}
                    > */}
              <div className={`font-medium truncate text-foreground`}>
                {track.title}
              </div>
              <div className="text-gray-400 text-sm truncate">
                {track.artist} Type Beat
              </div>
            </div>
          </button>

          {/* BPM */}
          <div className="hidden md:block md:col-span-1 text-foreground">
            {track.bpm} BPM
          </div>

          {/* Key */}
          <div className="hidden md:block md:col-span-2 text-foreground">
            {track.key}
          </div>

          {/* Date Added */}
          {/* <div className="hidden lg:block lg:col-span-2 text-foreground">
                  {track.dateAdded}
                </div> */}

          {/* Duration */}
          <div className="hidden md:block col-span-2 md:col-span-1 text-foreground text-start">
            {track.duration}
          </div>

          {/* Actions */}
          <div className="col-span-5 md:col-span-2 lg:col-span-2 flex justify-end space-x-2">
            {/* Download Button */}
            <button
              onClick={() => handleDownloadClick(track)}
              className="max-[900px]:hidden max-md:!block cursor-pointer bg-blue-600 text-foreground p-2 rounded font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
              title="Download"
            >
              <Download className="w-4 h-4 text-white" />
            </button>

            {/* Share Button */}
            <button
              onClick={() => handleShareClick(track)}
              className="max-[1140px]:hidden cursor-pointer bg-gray-600 text-foreground p-2 rounded font-medium text-sm hover:bg-gray-700 transition-colors flex items-center justify-center"
              title="Share"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>

            {/* Price/Cart Button */}
            {isTrackInCart(track._id) ? (
              <button className="!bg-green-500 text-black px-4 py-2 rounded font-medium text-sm min-w-28">
                IN CART
              </button>
            ) : (
              <button
                onClick={() => handleBuyClick(track)}
                className="min-w-28 cursor-pointer !bg-foreground  text-background px-4 py-2 rounded font-medium text-sm hover:!bg-gray-300 transition-colors flex items-center space-x-1"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>${track.price || track.licenses[0].price}</span>
              </button>
            )}
          </div>
        </motion.div>
        <LicenseModal
          isOpen={isLicenseModalOpen}
          onClose={() => setIsLicenseModalOpen(false)}
          track={selectedTrack}
        />
      </>
    );
  };
  // console.log(filteredTracks);

  return (
    <div className="z-50 flex flex-col justify-between relative">
      <div
        className={`py-32 flex flex-col justify-center items-center px-4 relative overflow-hidden`}
        // className={`${
        //   !limitTrackCount && 'sticky top-15 z-[51] bg-background'
        // }  py-32 flex flex-col justify-center items-center px-4`}
      >
        <video
          autoPlay
          loop
          muted
          className="absolute h-screen lg:h-auto scale-200 md:scale-140 z-0 opacity-10"
          src={StudioVideo}
        ></video>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <img
            className="w-xl mb-5 sm:mb-10 z-[50] relative"
            src={BirdieLogo}
            alt="Birdie Logo"
          />
        </motion.div>
        <div className="w-full z-2">
          <p className="mb-10 sm:mb-2 font-medium text-sm text-center sm:text-lg dark:text-foreground text-black">
            Search Beats Here
          </p>
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
            onSearch={(query) => {
              // This does the actual filtering
              // const filtered = sampleTracks.filter(
              //   (track) =>
              //     track.title.toLowerCase().includes(query.toLowerCase()) ||
              //     track.artist.toLowerCase().includes(query.toLowerCase())
              // );
              const allTracks = [...fetchedBeats, ...sampleTracks];
              const filtered = allTracks.filter(
                (track) =>
                  track.title.toLowerCase().includes(query.toLowerCase()) ||
                  track.artist.toLowerCase().includes(query.toLowerCase())
              );
              setFilteredTracks(filtered);
              setQueue(filtered);
            }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 z-5">
        {/* Header */}
        <div
          // className={`${
          //   !limitTrackCount &&
          //   'sticky top-[330px] md:top-[365px] bg-background z-[51]'
          // } grid grid-cols-10 gap-4 text-gray-400 text-sm font-medium border-b border-gray-800 pb-3 mb-4`}

          className={`grid grid-cols-10 gap-4 text-gray-400 text-sm font-medium border-b border-gray-800 pb-3 mb-4`}
        >
          <div className="col-span-5 md:col-span-4">Title</div>
          <div className="hidden md:block md:col-span-1">BPM</div>
          <div className="hidden md:block md:col-span-2">Key</div>
          {/* <div className="hidden lg:block lg:col-span-2">Date Added</div> */}
          <div className="hidden col-span-2 md:block md:col-span-1 flex justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div className="col-span-5 md:col-span-2 lg:col-span-2"></div>
        </div>

        {/* Track List */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-2 z-10"
        >
          {filteredTracks.length === 0 ? (
            <motion.div variants={itemVariants} className="text-center py-8">
              <p className="text-gray-400">
                No tracks found matching your search.
              </p>
            </motion.div>
          ) : (
            filteredTracks
              .slice(0, limitTrackCount ? 6 : 999)
              .map((track) => <TrackCard key={track.id} track={track} />)
          )}
        </motion.div>
      </div>
      {limitTrackCount ? (
        <NavLink to="/beats" className="z-50">
          <button className="w-fit text-white hover:bg-foreground hover:text-background  !transition-all !duration-600 bg-zinc-900">
            Browse All Beats
          </button>
        </NavLink>
      ) : (
        <NavLink to="/" className="z-50">
          <button className="w-fit text-white hover:bg-foreground hover:text-background  !transition-all !duration-600 bg-zinc-900">
            Back To Home
          </button>
        </NavLink>
      )}
    </div>
  );
};

export default TrackListing;

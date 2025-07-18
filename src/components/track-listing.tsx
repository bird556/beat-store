'use client';
import React from 'react';
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
import BirdieLogo from '../../public/Images/logo.png';
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
const TrackListing = ({ limitTrackCount, searchTerm, setSearchTerm }) => {
  // const { playTrack, setQueue, currentTrack, isPlaying } = useMusic();
  const { items: cartItems } = useCart();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTracks, setFilteredTracks] = useState<Track[]>(sampleTracks);
  const { playTrack, currentTrack, isPlaying, setQueue, queue } = usePlayer();
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

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTracks(sampleTracks);
    } else {
      const filtered = sampleTracks.filter(
        (track) =>
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTracks(filtered);
    }
  }, [searchQuery]);

  useEffect(() => {
    // setQueue(sampleTracks);
    if (!searchQuery.trim()) {
      setQueue(sampleTracks);
    } else {
      const filtered = sampleTracks.filter(
        (track) =>
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setQueue(filtered);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (defaultQuery) {
      const filtered = sampleTracks.filter(
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

  // const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  // };

  // const handlePlayTrack = (track: Track) => {
  //   // In demo mode, just select the track for UI demonstration
  //   playTrack(track);
  // };

  const handleBuyClick = (track: Track) => {
    setSelectedTrack(track);
    setIsLicenseModalOpen(true);
  };

  const isTrackInCart = (trackId: string) => {
    return cartItems.some((item) => item.id.startsWith(trackId));
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
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="z-50 grid grid-cols-10 gap-4 items-center py-3 px-2 rounded-lg hover:bg-foreground/15 transition-colors group"
        >
          {/* Title with Image */}
          <button
            // onClick={() => handlePlayTrack(track)}
            onClick={(e) => {
              e.stopPropagation();
              playTrack(track);
            }}
            // className="col-span-5 md:col-span-4 flex items-center space-x-3 cursor-pointer"
            className="!bg-transparent !p-0 hover:!border-transparent z-50 !text-start col-span-5 md:col-span-4 flex items-center space-x-3 cursor-pointer"
          >
            <div className="relative aspect-square overflow-hidden rounded cursor-pointer">
              {/* <Image
                      src={track.image || '/placeholder.svg'}
                      alt={track.title}
                      width={64}
                      height={64}
                      className="rounded"
                    /> */}
              <img className="w-20" src={track.image} alt={track.title} />
              <div
                // onClick={() => handlePlayTrack(track)}

                className="cursor-pointer scale-125 absolute inset-0 !bg-black/50 !border-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded"
              >
                {/* <Play className="w-4 h-4 text-foreground fill-white" /> */}
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
                {track.artist}
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
            {isTrackInCart(track.id) ? (
              <button className="!bg-green-500 text-black px-4 py-2 rounded font-medium text-sm min-w-28">
                IN CART
              </button>
            ) : (
              <button
                onClick={() => handleBuyClick(track)}
                className="min-w-28 cursor-pointer !bg-foreground  text-background px-4 py-2 rounded font-medium text-sm hover:!bg-gray-300 transition-colors flex items-center space-x-1"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>${track.price}</span>
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
        <img
          className="w-xl mb-5 sm:mb-10 z-1"
          src={BirdieLogo}
          alt="Birdie Logo"
        />
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
              const filtered = sampleTracks.filter(
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

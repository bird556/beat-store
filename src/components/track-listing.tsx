// src/components/track-listing.tsx

'use client';
import type { Track } from '../types';
import React from 'react';
import { PlaceholdersAndVanishInput } from './ui/placeholders-and-vanish-input';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Clock,
  Play,
  ShoppingCart,
  Download,
  Share2,
  Pause,
} from 'lucide-react';
import BirdieLogo1 from '../Images/cropped.png';
import { NavLink, useNavigate } from 'react-router';
import { usePlayer } from '@/contexts/PlayerContext';
import StudioVideo from '/Videos/music-studio.mp4';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '@/contexts/cart-context';
import { useBeats } from '@/contexts/BeatsContext';
import LicenseModal from './license-modal';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import FadeContent from './ui/ReactBits/FadeContent';
import SplitText from './ui/ReactBits/SplitText';
import MailerLitePopUpDownload from './MailerLitePopUpDownload';
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
/**
 * A track listing component that displays a list of tracks and allows the user to search
 * through them. It also allows the user to play, download, and share tracks.
 * @param {object} props - The component props.
 * @prop {number} limitTrackCount - The number of tracks to display. If not provided, it will
 * display all tracks.
 * @prop {string} searchTerm - The search term to filter the tracks by.
 * @prop {function} setSearchTerm - A function to set the search term.
 */
const TrackListing = ({ limitTrackCount }: { limitTrackCount?: number }) => {
  const { beats, isBeatsLoaded, fetchBeats, totalPages, currentPage } =
    useBeats();
  const { items: cartItems } = useCart();
  const { playTrack, currentTrack, isPlaying, setQueue, pauseTrack } =
    usePlayer();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();
  const defaultQuery = searchParams.get('search') || '';
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<Track | null>(null);

  const placeholders = [
    'Larry June Type Beat?',
    'Payroll Giovanni Type Beat?',
    'Playboi Carti Type Beat?',
    'Key Glock Type Beat?',
    'Drake Type Beat?',
    'Gunna Type Beat?',
    'G-Funk?',
  ];

  // Handle pagination and search
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const limit = limitTrackCount || 6;
    const fetchData = async () => {
      setIsFetching(true);
      await fetchBeats(page, limit, search);
      setIsFetching(false);
    };
    fetchData();
  }, [searchParams, limitTrackCount, fetchBeats]);

  // Set queue when beats change
  useEffect(() => {
    setQueue(beats);
  }, [beats, setQueue]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), search: defaultQuery });
  };

  // const handleSearch = debounce((query: string) => {
  //   setSearchParams({ search: query, page: '1' });
  // }, 1000); // Debounce search for 1 second

  const handleSearch = (query: string) => {
    setSearchParams({ search: query, page: '1' });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log('submitted');
  };

  /**
   * Handles the download button click. For demo purposes, this shows an alert, but
   * in production this would trigger a download of the track.
   * @param {Track} track The track to download
   */

  const performDownload = async (track: Track) => {
    try {
      if (!track.id) {
        toast.error('No track ID available.');
        return;
      }

      const toastId = toast.loading('Starting download...');

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL_BACKEND}/api/download/${track.id}`
      );
      const { downloadUrl } = response.data;

      if (!downloadUrl) {
        toast.error('No download URL available.', { id: toastId });
        return;
      }

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${track.artist} Type Beat - ${track.title} [Prod. Birdie Bands].mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // // --- GOOGLE ADS CONVERSION TRACKING START ---

      // // ⚠️ Note: For free downloads, we DO NOT send 'value' or 'currency'.
      // if (window.gtag) {
      //   window.gtag('event', 'conversion', {
      //     // You MUST replace 'FREE_DOWNLOAD_LABEL' with the label from Google Ads
      //     send_to: 'AW-17606081379/FREE_DOWNLOAD_LABEL',

      //     // Use an empty string for the transaction ID for a free lead.
      //     transaction_id: '',
      //     items: [
      //       {
      //         item_id: track.id.toString(), // e.g., '4567'
      //         item_name: track.title, // e.g., 'Sunset Cruisin'
      //         item_brand: track.artist, // e.g., 'The Beatles'
      //       },
      //     ],
      //   });
      // }

      // // --- GOOGLE ADS CONVERSION TRACKING END ---

      toast.success(`Download started for ${track.title}`, { id: toastId });
    } catch (error) {
      console.error('Error initiating download:', error);
      toast.error('Failed to download the track. Please try again later.');
    }
  };

  const handleDownloadClick = async (track: Track) => {
    if (
      localStorage.getItem('mailerlite_subscribed_for_downloads') === 'true'
    ) {
      performDownload(track);
    } else {
      setPendingDownload(track);
      setShowDownloadPopup(true);
    }
  };

  const handleShareClick = (track: Track) => {
    const shareUrl = `${window.location.origin}/beat?beatId=${track.id}`; // Use _id for the URL

    const shareText = `Check out this beat: "${track.title}" by ${track.artist} on Birdie Bands!`;
    if (navigator.share) {
      navigator
        .share({
          title: track.title,
          text: shareText,
          url: shareUrl,
        })
        .catch(() => {
          navigator.clipboard.writeText(shareUrl);
          toast.success('Share link copied to clipboard!');
        });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    }
  };

  const handleBuyClick = (track: Track) => {
    console.log(track, 'handle buy click');
    setSelectedTrack(track);
    setIsLicenseModalOpen(true);
  };

  const handleEditLicenseClick = (track: Track) => {
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
      // console.log('pause', isPlaying);
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

  const handleCardClick = (beat: Track) => {
    // Re-fetch the main beat when a related beat is clicked to update the page
    navigate(`/beat?beatId=${beat.id}`);
    // Consider adding a scroll to top here for a better UX
    window.scrollTo(0, 0);
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

  // Render pagination items with ellipsis and looping
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5; // Show 3 pages + 2 ellipses
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    // console.log('totalPages', totalPages);
    if (totalPages <= 1) {
      // Only show page 1
      return (
        <PaginationItem>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Previous button
    const isPreviousDisabled = currentPage === 1;
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          onClick={
            isPreviousDisabled
              ? undefined
              : () => handlePageChange(currentPage - 1)
          }
          className={isPreviousDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        />
      </PaginationItem>
    );

    // First page
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Visible pages
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            isActive={currentPage === page}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    const isNextDisabled = currentPage === totalPages;
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={
            isNextDisabled ? undefined : () => handlePageChange(currentPage + 1)
          }
          className={isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        />
      </PaginationItem>
    );

    return items;
  };

  // Slice beats for display (6 on homepage, all on /beats)
  const displayedBeats = limitTrackCount ? beats.slice(0, 6) : beats;

  const TrackCard = ({ track }: { track: Track }) => {
    // const ref = useRef(null);
    // const isInView = useInView(ref, { once: true });
    return (
      <>
        {/* I only want it to animate once..I dont want to do ref or isInview anymore */}
        <div className="z-50 grid grid-cols-10 gap-4 items-center py-3 px-2 rounded-lg hover:bg-foreground/10 transition-colors group">
          {/* Title with Image */}
          <div className="gap-3 !bg-transparent !p-0 hover:!border-transparent z-50 !text-start col-span-5 md:col-span-4 flex items-center space-x-3">
            <button
              onClick={(e) => handleTrackPlay(track, e)}
              className=" !relative !aspect-square !overflow-hidden !rounded !cursor-pointer !w-20 !min-w-20 !p-0 !m-0 !max-w-20 !border-none !outline-none hover:!outline-none hover:!border-none !bg-transparent hover:!bg-transparent"
            >
              <img
                className="w-full h-full object-cover"
                src={track.s3_image_url ? track.s3_image_url : BirdieLogo1}
                alt={track.title}
                loading="lazy"
              />
              {currentTrack?.id === track.id && (
                <div
                  className={`cursor-pointer scale-125 absolute inset-0 !bg-black/50 !border-transparent flex items-center justify-center transition-opacity rounded opacity-100`}
                >
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause className="w-4 h-4 text-foreground fill-white !outline-transparent !border-transparent !stroke-transparent" />
                  ) : (
                    <Play className="w-4 h-4 text-foreground fill-white !outline-transparent !border-transparent !stroke-transparent" />
                  )}
                </div>
              )}
              <div
                className={`cursor-pointer scale-125 absolute inset-0 !bg-black/50 !border-transparent flex items-center justify-center transition-opacity rounded opacity-0 group-hover:opacity-100`}
              >
                {currentTrack?.id === track.id && isPlaying ? (
                  <Pause className="w-4 h-4 text-foreground fill-white  !outline-transparent !border-transparent !stroke-transparent" />
                ) : (
                  <Play className="w-4 h-4 text-foreground fill-white  !outline-transparent !border-transparent !stroke-transparent" />
                )}
              </div>
            </button>
            <button
              onClick={() => handleCardClick(track)}
              className="min-w-0 !p-0 !m-0 text-start text-foreground hover:!text-green-400 !duration-200 !transition-colors !border-none !outline-none hover:!outline-none hover:!border-none !bg-transparent hover:!bg-transparent"
            >
              <div className={`font-medium truncate `}>{track.title}</div>
              <div className=" text-sm truncate font-medium">
                {track.artist} Type Beat
              </div>
            </button>
          </div>

          {/* BPM */}
          <button
            onClick={() => handleCardClick(track)}
            className="hidden text-nowrap !font-normal md:block md:col-span-1 text-foreground !border-none !outline-none hover:!outline-none hover:!border-none !bg-transparent hover:!bg-transparent"
          >
            {track.bpm} BPM
          </button>

          {/* Key */}
          <button
            onClick={() => handleCardClick(track)}
            className="hidden text-nowrap !font-normal md:block md:col-span-2 text-foreground !border-none !outline-none hover:!outline-none hover:!border-none !bg-transparent hover:!bg-transparent"
          >
            {track.key}
          </button>

          {/* Date Added */}
          {/* <div className="hidden lg:block lg:col-span-2 text-foreground">
                  {track.dateAdded}
                </div> */}

          {/* Duration */}
          <button
            onClick={() => handleCardClick(track)}
            className="hidden text-nowrap !font-normal md:block col-span-2 md:col-span-1 text-foreground text-start !p-0 !m-0 !border-none !outline-none hover:!outline-none hover:!border-none !bg-transparent hover:!bg-transparent"
          >
            {track.duration}
          </button>

          {/* Actions */}
          <div className="col-span-5 md:col-span-2 lg:col-span-2 flex justify-end space-x-2">
            {/* Download Button */}
            <button
              onClick={() => handleDownloadClick(track)}
              className="max-[900px]:hidden max-md:!block cursor-pointer !bg-blue-600 text-foreground p-2 rounded font-medium text-sm hover:!bg-blue-700 transition-colors flex items-center justify-center"
              title="Download"
            >
              <Download className="w-4 h-4 !text-white" />
            </button>

            {/* Share Button */}
            <button
              onClick={() => handleShareClick(track)}
              className="max-[1140px]:hidden cursor-pointer !bg-zinc-700 text-foreground p-2 rounded font-medium text-sm hover:!bg-gray-800 transition-colors flex items-center justify-center"
              title="Share"
            >
              <Share2 className="w-4 h-4 !text-white" />
            </button>

            {/* Price/Cart Button */}
            {isTrackInCart(track.id) ? (
              <button
                onClick={() => handleEditLicenseClick(track)}
                className="min-sm:min-w-28  !bg-green-600 hover:!bg-green-800 text-nowrap !transition-colors !duration-300 text-foreground px-4 py-2 rounded font-medium text-sm  "
              >
                <ShoppingCart className="w-4 h-4 min-sm:hidden" />
                <span className="hidden sm:block">IN CART</span>
              </button>
            ) : (
              <button
                onClick={() => handleBuyClick(track)}
                className="min-sm:min-w-28 cursor-pointer !bg-foreground  text-background px-4 py-2 rounded font-medium text-sm hover:!bg-white hover:!text-black dark:hover:!bg-gray-300 !transition-colors duration-300 flex items-center space-x-1"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:block">
                  ${track.price || track.licenses[0].price}
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
      </>
    );
  };

  const TrackCardSkeleton = () => {
    return (
      <>
        <div className="z-50 grid grid-cols-10 gap-4 items-center py-3 px-2 rounded-lg hover:bg-foreground/15 transition-colors group">
          {/*  */}
          <button className="!bg-transparent !p-0 hover:!border-transparent z-50 !text-start col-span-5 md:col-span-4 flex items-center space-x-3 cursor-pointer">
            <div className="relative aspect-square overflow-hidden rounded cursor-pointer">
              <Skeleton className="w-20 object-cover aspect-square" />
            </div>
            <div className="min-w-0 flex flex-col gap-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[170px] lg:w-[250px]" />
            </div>
          </button>

          {/* BPM */}
          <Skeleton className="hidden w-12 md:block md:col-span-1 text-foreground h-4 lg:w-16" />

          {/* Key */}
          <Skeleton className="hidden md:block md:col-span-1 -ml-7 lg:-ml-9 !col-start-7 text-foreground h-4 w-12 lg:w-16" />

          {/* Date Added */}

          <Skeleton className="hidden md:block md:col-span-1 -ml-3 lg:-ml-5 text-foreground h-4 w-12 lg:w-16" />

          {/* Duration */}
          <Skeleton className="hidden md:block col-span-2 md:col-span-1 text-foreground text-start" />
        </div>
      </>
    );
  };

  const handleAnimationComplete = () => {};
  return (
    <div className="z-50 flex flex-col justify-between relative">
      {/* SEO Meta Tags */}

      <div
        className={` bg-black py-16 flex flex-col justify-center items-center px-4 relative overflow-hidden`}
      >
        <video
          autoPlay
          loop
          muted
          className="hidden md:block !pointer-events-none absolute h-screen lg:h-auto scale-200 md:scale-140 z-0 opacity-25 dark:opacity-10"
          src={StudioVideo}
        ></video>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
        >
          <img
            className="max-sm:w-[12rem] w-xs mb-5 sm:mb-10 z-[50] relative !pointer-events-none [@media(max-height:745px)]:max-w-24"
            src={BirdieLogo1}
            alt="Birdie Logo"
            loading="lazy"
          />
        </motion.div>
        <div className="w-full z-2">
          {/* <p className="mb-10 sm:mb-2 font-medium text-sm text-center sm:text-lg text-white ">
            Search Beats Here
          </p> */}
          <SplitText
            text="Search Beats Here"
            className="mb-10 sm:mb-2 font-medium text-sm text-center sm:text-lg text-white [@media(max-height:745px)]:text-xs"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //   handleSearch(e.target.value)
            // }
            onChange={() => {}} // No-op for onChange
            onSubmit={onSubmit}
            onSearch={handleSearch}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 z-5">
        {/* Header */}
        <div
          className={`w-full min-w-full grid grid-cols-10 gap-4 dark:text-gray-400 text-sm font-medium border-b border-gray-800 pb-3 mb-4`}
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
          {/* {isFetching && (
            <div className="text-center py-4">
              <p className="text-gray-400">Loading...</p>
            </div>
          )} */}
          {!isFetching && displayedBeats.length === 0 && isBeatsLoaded && (
            <motion.div variants={itemVariants} className="text-center py-8">
              <p className="text-gray-400">
                No tracks found matching your search.
              </p>
            </motion.div>
          )}

          {isFetching || !isBeatsLoaded
            ? // map me 6 skeleton from TrackCardSkeleton
              Array.from({ length: 6 }).map((_, index) => (
                <TrackCardSkeleton key={index} />
              ))
            : !isFetching &&
              displayedBeats.map((track) => (
                <FadeContent
                  key={track.id}
                  initialOpacity={0}
                  blur={false}
                  duration={800}
                  delay={100}
                  threshold={0.1}
                >
                  <TrackCard track={track} />
                </FadeContent>
              ))}
        </motion.div>
        {!limitTrackCount && isBeatsLoaded && totalPages > 0 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              data-total={totalPages}
              data-active-page={currentPage}
              data-loop="true"
              data-controls={totalPages > 1 ? 'true' : 'false'}
              className="bg-zinc-900/0 rounded-lg max-w-fit"
            >
              <PaginationContent>{renderPaginationItems()}</PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      {limitTrackCount ? (
        <NavLink to="/beats" className="z-50">
          <button
            className={`${
              !isBeatsLoaded && 'hidden'
            } w-fit !text-white hover:!bg-white hover:!text-black  !transition-all !duration-600 !bg-zinc-900`}
          >
            Browse All Beats
          </button>
        </NavLink>
      ) : (
        <NavLink to="/" className="z-50">
          <button className="w-fit !text-white hover:!bg-white hover:!text-black  !transition-all !duration-600 !bg-zinc-900">
            Back To Home
          </button>
        </NavLink>
      )}
      <MailerLitePopUpDownload
        open={showDownloadPopup}
        onOpenChange={setShowDownloadPopup}
        onSuccess={() => {
          setShowDownloadPopup(false);
          if (pendingDownload) {
            performDownload(pendingDownload);
            setPendingDownload(null);
          }
        }}
      />
    </div>
  );
};

export default TrackListing;

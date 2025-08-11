// src/pages/SingleBeat.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'; // Added CardFooter
import {
  Download,
  Share2,
  ShoppingCart,
  Music, // For BPM
  Play,
  Pause,
  Clock,
} from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { usePlayer } from '@/contexts/PlayerContext'; // Corrected context name based on TrackListing
import LicenseModal from '@/components/license-modal'; // Assuming path
import axios from 'axios';
import toast from 'react-hot-toast';
import FadeContent from '@/components/ui/ReactBits/FadeContent';
import type { Track } from '../src/types';

interface Beat {
  artist: string;
  available: boolean;
  bpm: number;
  created_at: string;
  duration: string;
  id: string;
  key: string;
  licenses: object[];
  s3_image_url: string;
  s3_mp3_url: string;
  tags: string[];
  title: string;
  _id: string;
  audioUrl?: string;
  image?: string;
}

// --- SingleBeatPage Component ---
export default function SingleBeatPage() {
  //   const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  // const { addToCart, isTrackInCart } = useCart();
  const { items: cartItems } = useCart();

  const { currentTrack, playTrack, isPlaying, pauseTrack } = usePlayer(); // Corrected context name

  const [beat, setBeat] = useState<Track | null>(null); // Use Track interface
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false); // New state for related beats loading
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [relatedBeats, setRelatedBeats] = useState<Track[]>([]); // New state for related beats

  useEffect(() => {
    const beatId = new URLSearchParams(location.search).get('beatId');
    if (!beatId) {
      setError('Beat ID not provided in URL.');
      setIsLoading(false);
      return;
    }

    const fetchBeat = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use your environment variable for the backend URL
        // const response = await axios.get(
        //   `${import.meta.env.VITE_API_BASE_URL_BACKEND}/api/beat/${beatId}`
        // );
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL_BACKEND}/beat?beatId=${beatId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (response.status !== 200) {
          // Check status for non-OK responses
          if (response.status === 404) {
            throw new Error(
              'Beat not found. It might have been removed or the link is incorrect.'
            );
          }
          throw new Error(
            `Failed to fetch beat data: Status ${response.status}`
          );
        }

        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setBeat({
            ...data,
            id: data._id,
          });
          document.title = `Birdie Bands - ${data.title}`;
          // After fetching the main beat, fetch related beats using its tags
          if (data.tags && data.tags.length > 0) {
            fetchRelatedBeats(data.tags, data._id);
          } else {
            setRelatedBeats([]); // No tags, no related beats
          }
        }
      } catch (err) {
        console.error('Fetch beat error:', err);
        setError('Failed to load beat');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRelatedBeats = async (tags: string[], excludeBeatId: string) => {
      setIsLoadingRelated(true); // Start loading related beats

      try {
        const tagsQueryParam = tags.join(','); // Join tags with commas
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL_BACKEND
          }/related-beats?tags=${tagsQueryParam}&excludeBeatId=${excludeBeatId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (response.status !== 200) {
          console.error(
            `Failed to fetch related beats: Status ${response.status}`
          );
          setRelatedBeats([]); // Clear related beats on error
          return;
        }

        const data = await response.json();
        if (data.error) {
          console.error('Error fetching related beats:', data.error);
          setRelatedBeats([]);
        } else {
          setRelatedBeats(
            data.map((b: Beat) => ({
              ...b,
              id: b._id, // Map _id to id for consistency
              audioUrl: b.s3_mp3_url || b.audioUrl, // Ensure audioUrl is correct
              image: b.s3_image_url || b.image, // Ensure image is correct
            }))
          );
          setIsLoadingRelated(false);
        }
      } catch (err) {
        console.error('Fetch related beats error:', err);
        setRelatedBeats([]);
      }
    };

    fetchBeat();
  }, [location.search]); // Depend on id to re-fetch if URL param changes
  const handleDownloadClick = async (beat: Track) => {
    try {
      if (!beat.id) {
        toast.error('No beat ID available for download.');
        return;
      }

      const toastId = toast.loading('Starting download...');

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL_BACKEND}/api/download/${beat.id}`
      );
      const { downloadUrl } = response.data;

      if (!downloadUrl) {
        toast.error('No download URL available.', { id: toastId });
        return;
      }

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${beat.artist} Type Beat - ${beat.title} [Prod. Birdie Bands].mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Download started for ${beat.title}`, { id: toastId });
    } catch (error) {
      console.error('Error initiating download:', error);
      toast.error('Failed to download the track. Please try again later.');
    }
  };

  const handleShareClick = (beat: Track) => {
    const shareUrl = `${window.location.origin}/beat/${beat.id}`; // Use _id for the URL
    const shareText = `Check out this beat: "${beat.title}" by ${beat.artist} on Birdie Bands!`;

    if (navigator.share) {
      navigator
        .share({
          title: beat.title,
          text: shareText,
          url: shareUrl,
        })
        .catch((error) => {
          console.error('Error sharing:', error);
          // Fallback to clipboard if native share fails or is not available
          navigator.clipboard
            .writeText(shareUrl)
            .then(() => toast.success('Link copied to clipboard!'))
            .catch(() => toast.error('Failed to copy link.'));
        });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => toast.success('Link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link.'));
    }
  };

  const handleBuyClick = (beat: Track) => {
    setSelectedTrack(beat);
    setIsLicenseModalOpen(true);
  };

  const isTrackInCart = (trackId: string) => {
    return cartItems.some((item) => item.id === trackId);
  };

  const handleEditLicenseClick = (track: Track) => {
    setSelectedTrack(track);
    setIsLicenseModalOpen(true);
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

  if (error) {
    return (
      <div className="z-50 relative max-w-4xl mx-auto px-4 py-16 min-h-[60vh] flex flex-col justify-center items-center">
        <Card className="max-w-md mx-auto bg-card text-card-foreground shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-500 text-3xl font-bold">
              Error Loading Beat!
            </CardTitle>
            <CardDescription className="text-md mt-2">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mt-2">
              Please verify the link or return to the homepage to browse other
              beats.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => navigate('/')}
              className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Go to Homepage
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const RelatedBeatCard: React.FC<{ beat: Track }> = ({ beat }) => {
    const navigate = useNavigate(); // useNavigate hook should be called at the top level of the component
    const handleCardClick = () => {
      // Re-fetch the main beat when a related beat is clicked to update the page
      navigate(`/beat?beatId=${beat.id}`);
      // Consider adding a scroll to top here for a better UX
      window.scrollTo(0, 0);
    };

    const currentBeatPlaying = currentTrack?.id === beat.id && isPlaying;
    // const currentBeat = currentTrack?.id === beat.id;

    return (
      <div className="max-md:border-b-[1px] max-md:py-16 max-md:!flex max-md:!flex-col z-50 grid grid-cols-10 gap-4 items-center py-3 px-2 min-md:rounded-lg min-md:hover:bg-foreground/15 transition-colors group">
        {/* Title with Image */}
        <div className="max-md:!flex max-md:!flex-col max-md:w-96 gap-3 !bg-transparent !p-0 hover:!border-transparent z-50 !text-start col-span-5 md:col-span-4 flex items-center space-x-3">
          <button
            onClick={(e) => handleTrackPlay(beat, e)}
            className="!relative !aspect-square !overflow-hidden !rounded-lg !cursor-pointer min-md:!w-20 min-md:!min-w-20 !p-0 !m-0 min-md:!max-w-20"
          >
            <img
              className="w-full h-full max-w-xs object-cover max-md:!rounded-lg"
              src={beat.image || beat.s3_image_url || '/placeholder-beat.png'}
              alt={beat.title}
            />
            {currentTrack && currentTrack.id === beat.id && (
              // {currentBeat?.id === beat.id && (
              <div className="cursor-pointer scale-125 absolute inset-0 !bg-black/50 !border-transparent flex items-center justify-center transition-opacity rounded opacity-100">
                {currentBeatPlaying ? (
                  <Pause className="w-4 h-4 text-foreground fill-white" />
                ) : (
                  <Play className="w-4 h-4 text-foreground fill-white" />
                )}
              </div>
            )}
            <div className="cursor-pointer scale-125 absolute inset-0 !bg-black/50 !border-transparent flex items-center justify-center transition-opacity rounded opacity-0 group-hover:opacity-100">
              {currentBeatPlaying ? (
                <Pause className="w-4 h-4 text-foreground fill-white" />
              ) : (
                <Play className="w-4 h-4 text-foreground fill-white" />
              )}
            </div>
          </button>
          <button
            onClick={() => handleCardClick()}
            className="max-md:text-center min-w-0 !p-0 !m-0 text-start text-foreground hover:!text-green-400 !duration-200 !transition-colors"
          >
            <div className="font-medium truncate">{beat.title}</div>
            <div className="text-sm truncate font-medium">
              {beat.artist} Type Beat
            </div>
          </button>
        </div>

        {/* BPM */}
        <div className="hidden md:block md:col-span-1 text-foreground">
          {beat.bpm} BPM
        </div>

        {/* Key */}
        <div className="hidden md:block md:col-span-2 text-foreground">
          {beat.key}
        </div>

        {/* Duration */}
        <div className="hidden md:block col-span-2 md:col-span-1 text-foreground text-start">
          {beat.duration}
        </div>
        <div className="min-md:hidden max-md:flex items-center  space-x-6 text-md text-gray-300 mb-6">
          <p className="flex items-center space-x-2">
            <Music className="w-5 h-5 text-gray-300" />
            <span>BPM {beat.bpm}</span>
          </p>
          <p className="flex items-center space-x-2">
            <span className="text-lg font-bold">♫</span>
            <span>{beat.key}</span>
          </p>
          <p className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-300" />
            <span>{beat.duration}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="col-span-5 md:col-span-2 lg:col-span-2 flex justify-end space-x-2">
          {/* Download Button */}
          <button
            onClick={() => handleDownloadClick(beat)}
            className="max-[900px]:hidden max-md:!block cursor-pointer bg-blue-600 text-foreground p-2 rounded font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
            title="Download"
          >
            <Download className="w-4 h-4 text-white" />
          </button>

          {/* Share Button */}
          <button
            onClick={() => handleShareClick(beat)}
            className="max-[1140px]:hidden cursor-pointer bg-gray-600 text-foreground p-2 rounded font-medium text-sm hover:bg-gray-700 transition-colors flex items-center justify-center"
            title="Share"
          >
            <Share2 className="w-4 h-4 text-white" />
          </button>

          {/* Price/Cart Button */}
          {isTrackInCart(beat.id) ? (
            <button
              onClick={() => handleEditLicenseClick(beat)}
              className="!bg-green-600 text-foreground px-4 py-2 rounded font-medium text-sm lg:min-w-28"
            >
              <ShoppingCart className="w-4 h-4 min-sm:hidden" />
              <span className="hidden sm:block">IN CART</span>
            </button>
          ) : (
            <button
              onClick={() => handleBuyClick(beat)}
              className="lg:min-w-28 cursor-pointer !bg-foreground text-background px-4 py-2 rounded font-medium text-sm hover:!bg-gray-300 transition-colors flex items-center space-x-1"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:block">
                ${beat.price || beat.licenses[0].price}
              </span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="z-50 relative max-w-6xl mx-auto px-4 py-16 min-h-[60vh]">
      {isLoading ? (
        // Main Beat Skeleton Loading State
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Image and Player Skeleton */}
          <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
            <Skeleton className="w-80 h-80 rounded-lg shadow-xl mb-6" />
            <Skeleton className="h-12 w-full max-w-80 rounded-lg" />
            <div className="flex space-x-4 mt-6 w-full max-w-80">
              <Skeleton className="h-10 w-1/2 rounded-md" />
              <Skeleton className="h-10 w-1/2 rounded-md" />
            </div>
            <Skeleton className="h-12 w-full max-w-80 rounded-md mt-4" />{' '}
            {/* Buy button skeleton */}
          </div>
          {/* Details Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
            <Skeleton className="h-24 w-full mt-4" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="bg-muted/20 p-4">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : beat ? (
        <FadeContent
          initialOpacity={0}
          blur={false}
          duration={500}
          delay={0}
          threshold={0.1}
        >
          {' '}
          {/* Use a React Fragment to return multiple top-level elements */}
          {/* Loaded Main Beat Content - Refactored to match the image, NOT using Card */}
          <div className="dark:bg-zinc-900/0 dark:text-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row p-6 md:p-0">
            {/* Image Section */}
            <div className="w-full md:w-1/3 flex-shrink-0 relative  aspect-square">
              <img
                src={beat.image || beat.s3_image_url || '/placeholder-beat.png'}
                alt={beat.title}
                className="w-full h-full object-cover rounded-lg "
              />
              <div
                className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 
                  opacity-100city-0 hover:opacity-100'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrackPlay(beat, e);
                }}
              >
                {currentTrack?.id === beat.id && isPlaying ? (
                  <Pause className="w-16 h-16 text-white fill-white cursor-pointer" />
                ) : (
                  <Play className="w-16 h-16 text-white fill-white cursor-pointer" />
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center space-x-4 mb-4">
                <div>
                  <h1 className="!text-2xl font-bold dark:text-white !text-start">
                    {' '}
                    {/* Changed CardTitle to h1 */}
                    {beat.title}
                  </h1>
                  <p className="!text-xl text-gray-800 dark:text-gray-400 mt-1 text-start">
                    {' '}
                    {/* Changed CardDescription to p */}
                    {beat.artist} Type Beat
                  </p>
                </div>
              </div>

              {/* Metadata (BPM, Key, Date) */}
              <div className="flex items-center space-x-6 text-lg text-gray-700 dark:text-gray-300 mb-6">
                <p className="flex items-center space-x-2">
                  <Music className="w-5 h-5 dark:text-gray-300" />
                  <span>BPM {beat.bpm}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="text-lg font-bold">♫</span>
                  <span>{beat.key}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 dark:text-gray-300" />
                  <span>{beat.duration}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {beat.licenses.length > 0 ? (
                  isTrackInCart(beat.id) ? (
                    <button
                      onClick={() => handleEditLicenseClick(beat)}
                      className="flex-1 bg-green-500 text-black px-8 py-3 rounded-md text-lg font-bold flex items-center justify-center space-x-2 transition-colors"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      <span>In Cart</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuyClick(beat)}
                      className="flex-1 bg-white text-black px-8 py-3 rounded-md text-lg font-bold flex items-center justify-center space-x-2 hover:bg-gray-300 transition-colors"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      <span>${beat.licenses[0].price}</span>
                    </button>
                  )
                ) : beat.price ? (
                  isTrackInCart(beat.id) ? (
                    <button
                      className="flex-1 bg-green-500 text-black px-8 py-3 rounded-md text-lg font-bold flex items-center justify-center space-x-2 transition-colors"
                      disabled
                    >
                      <ShoppingCart className="w-6 h-6" />
                      <span>In Cart</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuyClick(beat)}
                      className="flex-1 bg-white text-black px-8 py-3 rounded-md text-lg font-bold flex items-center justify-center space-x-2 hover:bg-gray-300 transition-colors"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      <span>${beat.price}</span>
                    </button>
                  )
                ) : null}

                <button
                  onClick={() => handleDownloadClick(beat)}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700 transition-colors text-lg flex items-center justify-center space-x-2"
                  title="Download"
                >
                  <Download className="w-6 h-6" />
                  <span>DOWNLOAD</span>
                </button>
                <button
                  onClick={() => handleShareClick(beat)}
                  className="flex-1 bg-gray-700 text-white hover:bg-gray-600 transition-colors text-lg flex items-center justify-center space-x-2"
                  title="Share"
                >
                  <Share2 className="w-6 h-6" />
                  <span>SHARE</span>
                </button>
              </div>
            </div>
          </div>
          {/* Related Beats Section */}
          <section className="mt-16">
            <h2 className="!text-2xl font-bold text-foreground mb-8 text-center border-b-2 pb-4">
              More Like This
            </h2>
            {isLoadingRelated ? (
              // Skeleton for Related Beats
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="relative group overflow-hidden">
                    <Skeleton className="w-full aspect-square rounded-t-lg" />
                    <CardHeader className="p-3">
                      <Skeleton className="h-6 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardFooter className="p-3 pt-0">
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : relatedBeats.length > 0 ? (
              // Display Related Beats if loaded and exist
              <div className=" grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedBeats.map((relatedBeat) => (
                  <RelatedBeatCard key={relatedBeat.id} beat={relatedBeat} />
                ))}
              </div>
            ) : (
              // Message if no related beats found
              <p className="text-center text-muted-foreground text-lg">
                No related beats found at this time.
              </p>
            )}
          </section>
        </FadeContent>
      ) : null}

      {/* License Modal */}
      <LicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
        track={selectedTrack}
      />
    </div>
  );
}

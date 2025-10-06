// src/pages/SingleBeat.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import type { Pack } from '../src/types';
import FadeContent from '@/components/ui/ReactBits/FadeContent';
import type { Track } from '../src/types';
import BirdieLogo from '../src/Images/birdie2025-logo.png';
import { useCart } from '@/contexts/cart-context';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/theme-provider';
import toast from 'react-hot-toast';

import { usePlayer } from '@/contexts/PlayerContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'; // Added CardFooter
import { Download, Share2, ShoppingCart, Play, Pause } from 'lucide-react';
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function SinglePack() {
  const navigate = useNavigate();
  const location = useLocation();

  const [pack, setPack] = useState<Pack | null>(null); // Use Pack interface
  const { currentTrack, playTrack, isPlaying, pauseTrack } = usePlayer(); // Corrected context name
  const { theme } = useTheme();
  const { items: cartItems, addToCart, removeFromCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  // const [pendingDownload, setPendingDownload] = useState<Pack | null>(null);

  useEffect(() => {
    const packId = new URLSearchParams(location.search).get('packId');
    if (!packId) {
      setError('pack ID not provided in URL.');
      setIsLoading(false);
      return;
    }

    const fetchPack = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use your environment variable for the backend URL
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL_BACKEND}/pack?packId=${packId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (response.status !== 200) {
          // Check status for non-OK responses
          if (response.status === 404) {
            throw new Error(
              'Pack not found. It might have been removed or the link is incorrect.'
            );
          }
          throw new Error(
            `Failed to fetch Pack data: Status ${response.status}`
          );
        }

        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setPack({
            ...data,
            id: data._id,
          });
          document.title = `Birdie Bands - ${data.title}`;
          // --- GOOGLE ANALYTICS 4 (GA4) E-COMMERCE TRACKING START: view_item ---
          if (window.gtag) {
            window.gtag('event', 'view_item', {
              send_to: 'G-K8ZTDYC2LD',
              currency: 'USD',
              // Assuming data.price contains the pack's price
              value: data.price ? data.price : 0.0,
              items: [
                {
                  item_id: data._id.toString(),
                  item_name: data.title,
                  item_brand: 'Birdie Bands', // Or your producer name
                  // Add the price if available in the pack data
                  price: data.price ? data.price : undefined,
                  // Set category to clearly identify it as a Pack
                  item_category: 'Pack',
                },
              ],
            });
          }
          // --- GOOGLE ANALYTICS 4 (GA4) E-COMMERCE TRACKING END ---
        }
      } catch (err) {
        console.error('Fetch Pack error:', err);
        setError('Failed to load Pack');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPack();
  }, [location.search]); // Depend on id to re-fetch if URL param changes

  const packToTrack = (pack: Pack): Track => {
    const artistFeature =
      pack.licenses.length > 0 ? pack.licenses[0].features[0] : '';
    // Create a new Track object from the Pack object
    const track: Track = {
      id: pack.id,
      title: pack.title,
      artist: artistFeature,
      bpm: 0,
      key: '',
      dateAdded: '',
      duration: '',
      price: pack.price,
      image: pack.s3_image_url || '',
      audioUrl: pack.s3_mp3_url,
      licenses: pack.licenses,
      s3_mp3_url: pack.s3_mp3_url,
      s3_image_url: pack.s3_image_url || '',
      tags: pack.tags,
      available: pack.available,
      type: pack.type,
      // Add other properties required by Track type
    };
    return track;
  };

  const handleTrackPlay = (pack: Pack, e: React.MouseEvent) => {
    e.stopPropagation();
    // If this is the current track and it's playing, pause it
    if (currentTrack?.id === pack.id && isPlaying) {
      pauseTrack();
      // console.log('pause', isPlaying);
    }
    // If this is the current track but paused, resume playback
    else if (currentTrack?.id === pack.id && !isPlaying) {
      playTrack(packToTrack(pack));
    }
    // If it's a different track, play it
    else {
      playTrack(packToTrack(pack));
    }
  };

  const handleBuyClick = (track: Track) => {
    const updatedItem = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      price: track.price,
      license: track.licenses[0].type,
      image: track.image || track.s3_image_url,
      key: track.key,
      bpm: track.bpm,
      duration: track.duration,
      audioUrl: track.audioUrl,
      dateAdded: track.dateAdded,
      licenses: track.licenses,
      effectivePrice: track.price,
      s3_mp3_url: track.s3_mp3_url,
      s3_image_url: track.s3_image_url,
      tags: track.tags,
      type: track.type,
      available: track.available,
    };
    addToCart(updatedItem);
    toast.success('Pack added to cart.', {
      style: {
        background: theme === 'dark' ? '#333' : '#fff',
        color: theme === 'dark' ? '#fff' : '#333',
      },
    });
  };

  const isTrackInCart = (trackId: string) => {
    return cartItems.some((item) => item.id === trackId);
  };

  if (error) {
    return (
      <div className="z-50 relative max-w-4xl mx-auto px-4 py-16 min-h-[60vh] flex flex-col justify-center items-center">
        <Card className="max-w-md mx-auto bg-card text-card-foreground shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-red-500 text-3xl font-bold">
              Error Loading Sample Pack!
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

  // Construct absolute URLs for SEO meta tags (assuming s3_image_url is absolute; adjust if needed)
  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}/pack?packId=${pack?.id || ''}`;
  const imageUrl = pack?.s3_image_url || BirdieLogo; // Use absolute if possible; prepend base if relative
  const description = pack
    ? `Download "${pack.title}". High-quality sample kits, royalty free sound kits, and loops for music production.`
    : 'Discover high-quality sample packs on Birdie Bands.';
  const keywords = pack?.tags
    ? [
        ...pack.tags,
        'type beat',
        'loop pack',
        'sample pack',
        'sound kit',
        'sound kits',
        'birdie bands',
      ].join(', ')
    : 'type beat, loop pack, sample pack, sound kit, sound kits';
  const title = pack
    ? `${pack.title} | Birdie Bands`
    : 'Birdie Bands - Sample Pack';
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph for social sharing (Facebook, LinkedIn, etc.) */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="music.song" />
        <meta property="og:site_name" content="Birdie Bands" />

        {/* Twitter Card for X (formerly Twitter) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />

        {/* Optional: Structured Data (JSON-LD) for rich snippets */}
        {pack && (
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MusicRecording',
              name: pack.title,
              byArtist: {
                '@type': 'Person',
                name: 'Birdie Bands',
              },
              image: imageUrl,
              url: canonicalUrl,
              genre: pack.tags || ['Sample Packs', 'Loop Kit'],
              offers: {
                '@type': 'Offer',
                url: canonicalUrl,
                priceCurrency: 'USD',
                price: pack.price || '0',
                availability: 'https://schema.org/InStock',
              },
            })}
          </script>
        )}
      </Helmet>
      <div className="z-50 relative max-w-6xl mx-auto px-4 py-16 min-h-[60vh]">
        {isLoading ? (
          // Main Beat Skeleton Loading State
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Image and Player Skeleton */}
            <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
              <Skeleton className="w-80 h-80 rounded-lg shadow-xl mb-6" />
              {/* <Skeleton className="h-12 w-full max-w-80 rounded-lg" />
            <div className="flex space-x-4 mt-6 w-full max-w-80">
              <Skeleton className="h-10 w-1/2 rounded-md" />
              <Skeleton className="h-10 w-1/2 rounded-md" />
            </div>
            <Skeleton className="h-12 w-full max-w-80 rounded-md mt-4" />{' '}
            Buy button skeleton */}
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
            </div>
          </div>
        ) : pack ? (
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
            <div className="dark:bg-zinc-900/0 dark:text-white  rounded-lg overflow-hidden flex flex-col md:flex-row p-6 md:p-0">
              {/* Image Section */}
              <button className="!p-0 w-full md:w-1/3 flex-shrink-0 relative  aspect-square">
                <img
                  src={pack.s3_image_url ? pack.s3_image_url : BirdieLogo}
                  alt={pack.title}
                  className="w-full h-full object-cover rounded-lg pointer-none: "
                  loading="lazy"
                />
                <div
                  className={`absolute rounded-lg inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 
                  opacity-100city-0 hover:opacity-100'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrackPlay(pack, e);
                  }}
                >
                  {currentTrack?.id === pack.id && isPlaying ? (
                    <Pause className="w-16 h-16 text-white fill-white cursor-pointer !outline-transparent !border-transparent !stroke-transparent" />
                  ) : (
                    <Play className="w-16 h-16 text-white fill-white cursor-pointer !outline-transparent !border-transparent !stroke-transparent" />
                  )}
                </div>
              </button>

              {/* Details Section */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="space-y-4">
                    <h1 className="!text-5xl font-bold dark:text-white !text-start ">
                      {' '}
                      {/* Changed CardTitle to h1 */}
                      {pack.title}
                    </h1>
                    <p className="text-start  dark:text-gray-300">
                      {pack.licenses[0].description}
                    </p>
                    <ul className="flex flex-wrap mt-2 items-center justify-center space-x-2">
                      {pack.licenses.map((license) =>
                        license.features.slice(0, 4).map((feature, index) => (
                          <Badge
                            className="mb-2"
                            variant="secondary"
                            key={index}
                          >
                            {feature}
                          </Badge>
                        ))
                      )}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Price/Cart Button */}
                  {isTrackInCart(pack.id) ? (
                    <button
                      onClick={() => removeFromCart(pack.id)}
                      className="flex-1 !bg-green-600  text-foreground px-4 py-2 rounded font-medium text-sm lg:min-w-28 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4 min-sm:hidden" />
                      <span className="hidden sm:block">IN CART</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuyClick(packToTrack(pack))}
                      className="flex-1 lg:min-w-28 cursor-pointer !bg-foreground text-background px-4 py-2 rounded font-medium text-sm hover:!bg-white hover:!text-black dark:hover:!bg-gray-300 !transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="hidden sm:block">
                        ${pack.licenses[0].price}
                      </span>
                    </button>
                  )}

                  <button
                    // onClick={() => handleDownloadClick(beat)}
                    className="flex-1 !bg-blue-600 !text-white hover:!bg-blue-700 transition-colors text-lg flex items-center justify-center space-x-2"
                    title="Download"
                  >
                    <Download className="w-6 h-6" />
                    <span>DOWNLOAD</span>
                  </button>
                  <button
                    // onClick={() => handleShareClick(beat)}
                    className="flex-1 !bg-zinc-800 !text-white hover:!bg-zinc-900 transition-colors text-lg flex items-center justify-center space-x-2"
                    title="Share"
                  >
                    <Share2 className="w-6 h-6" />
                    <span>SHARE</span>
                  </button>
                </div>
              </div>
            </div>
          </FadeContent>
        ) : null}

        {/* <MailerLitePopUpDownload
        open={showDownloadPopup}
        onOpenChange={setShowDownloadPopup}
        onSuccess={() => {
          setShowDownloadPopup(false);
          if (pendingDownload) {
            performDownload(pendingDownload);
            setPendingDownload(null);
          }
        }}
      /> */}
      </div>
    </>
  );
}

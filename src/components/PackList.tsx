import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import type { Pack, Track } from '../types';
import { usePlayer } from '@/contexts/PlayerContext';
import { useCart } from '@/contexts/cart-context';
import { useBeatPacks } from '@/contexts/BeatPackContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Play, Pause, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTheme } from '@/contexts/theme-provider';
import toast from 'react-hot-toast';

// framer motion
const containerVariants = {
  hidden: {
    opacity: 0,
    translateY: 50,
  },
  visible: {
    opacity: 1,
    translateY: 0,
    transition: {
      staggerChildren: 0.25, // Delay between items
      delayChildren: 0.25,
      duration: 0.5,
    },
  },
};

const PackList = () => {
  const [
    searchParams,
    // setSearchParams
  ] = useSearchParams();
  // const [packData, setPackData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const navigate = useNavigate();
  const { items: cartItems, addToCart, removeFromCart } = useCart();
  const { theme } = useTheme();

  const {
    playTrack,
    currentTrack,
    isPlaying,
    // setQueue,
    pauseTrack,
  } = usePlayer();
  const {
    packs,
    isPacksLoaded,
    fetchPacks,
    // totalPacks,
    // totalPages,
    // currentPage,
  } = useBeatPacks();
  // Handle pagination and search
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const limit = 10;
    const fetchData = async () => {
      setIsFetching(true);
      await fetchPacks(page, limit, search);
      setIsFetching(false);
    };
    fetchData();
  }, [searchParams, fetchPacks]);

  // const isPackInCart = (packId: string) => {
  //   return cartItems.some((item) => item.id === packId);
  // };

  const packToTrack = (pack: Pack): Track => {
    // Create a new Track object from the Pack object
    const track: Track = {
      id: pack.id,
      title: pack.title,
      artist: pack.licenses[0].type,
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
  return (
    <section className="py-16 z-50 relative">
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            Latest Sample Loops & Drum Kits
          </Badge>
          <h2 className="mb-3 text-3xl font-bold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            Sound Kits
          </h2>
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            Industry-ready beat packs crafted for hip hop, trap, soul, and West
            Coast producers. Exclusive sounds, royalty-free, and built to
            inspire.
          </p>
          <Button variant="link" className="w-full sm:w-auto" asChild></Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {!isPacksLoaded || isFetching
            ? Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="!h-[500px] w-[300px]" />
              ))
            : packs.map((pack) => {
                const currentBeatPlaying =
                  currentTrack?.id === pack.id && isPlaying;

                return (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-2 z-10"
                  >
                    <Card
                      key={pack.id}
                      className="grid grid-rows-[auto_auto_1fr_auto] pt-0 overflow-hidden"
                    >
                      <button
                        onClick={(e) => handleTrackPlay(pack, e)}
                        className="aspect-16/9 max-w-2xl relative overflow-hidden !p-0 !m-0"
                      >
                        <div className="overflow-hidden absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                          {currentBeatPlaying ? (
                            <Pause className="w-16 h-16 text-white fill-white" />
                          ) : (
                            <Play className="w-16 h-16 text-white fill-white" />
                          )}
                        </div>

                        <img
                          src={pack.s3_image_url ?? undefined}
                          alt={pack.title}
                          className="h-full w-full object-cover object-center overflow-hidden"
                        />
                      </button>
                      <CardHeader>
                        <div className="mb-4 md:mb-6">
                          <div className="flex items-center justify-center flex-wrap gap-3 text-xs tracking-wider text-muted-foreground uppercase md:gap-5 lg:gap-6">
                            {pack.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index}>{tag}</Badge>
                            ))}
                          </div>
                        </div>
                        <Tooltip>
                          <TooltipTrigger
                            onClick={() => navigate(`/pack?packId=${pack.id}`)}
                          >
                            <h3 className="!text-2xl font-semibold hover:underline md:text-xl">
                              {pack.title}
                            </h3>
                          </TooltipTrigger>
                          <TooltipContent>Open Pack</TooltipContent>
                        </Tooltip>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-4">
                          <p className="text-muted-foreground">
                            {pack.licenses[0].description
                              .split(' ')
                              .slice(0, 25)
                              .join(' ') + '...'}
                          </p>
                          <ul className="flex flex-wrap gap-2 items-center justify-center">
                            {pack.licenses.map((license, index) =>
                              license.features
                                .slice(0, 4)
                                .map((feature, featureIndex) => (
                                  <Badge
                                    variant={'outline'}
                                    key={`${index}-${featureIndex}`}
                                  >
                                    {feature}
                                  </Badge>
                                ))
                            )}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter>
                        {isTrackInCart(pack.id) ? (
                          <button
                            onClick={() => removeFromCart(pack.id)}
                            className="w-full !bg-green-600 hover:!bg-green-800  lg:min-w-28 cursor-pointer text-background px-4 py-2 rounded font-medium text-sm  hover:!text-black dark:hover:!bg-gray-300 !transition-colors duration-300 flex items-center justify-center space-x-1"
                          >
                            <ShoppingCart className="w-4 h-4 min-md:hidden max-md:mx-auto" />
                            <span className="hidden md:block">IN CART</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBuyClick(packToTrack(pack))}
                            className="w-full  lg:min-w-28 cursor-pointer !bg-foreground text-background px-4 py-2 rounded font-medium text-sm  hover:!text-black  !transition-colors duration-300 flex items-center justify-center space-x-1"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="hidden sm:block">
                              ${pack.licenses[0].price}
                            </span>
                          </button>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default PackList;

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';
import axios from 'axios';

export const HoverEffect = ({
  items,
  isLoading,
  className,
}: {
  items: {
    id: string;
    title: string;
    description: string;
    link: string;
    bulletPoints: Array<string>;
  }[];
  isLoading: boolean;
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { isOpen, onClose } = useDisclosure();
  const [selectedItemIndex] = useState<number | null>(null); // Add this line
  const [isLoaded, setIsLoaded] = useState(false);

  const handleDownloadClick = async (license: string) => {
    if (!license) {
      toast.error('No track ID available.');
      return;
    }

    const downloadPromise = axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL_BACKEND
      }/api/licenses/download/${license}`
    );

    toast.promise(downloadPromise, {
      loading: 'Loading License Preview...',
      success: (response) => {
        const { downloadUrl } = response.data;

        if (!downloadUrl) {
          throw new Error('No download URL available.');
        }

        // Open PDF in a new tab instead of downloading
        window.open(downloadUrl, '_blank');

        return `Preview Opened`;
      },
      error: (error) => {
        console.error('Download error:', error);
        return error.response?.data?.message || 'Failed to load the preview.';
      },
    });
  };
  useEffect(() => {
    setIsLoaded(isLoading);
  }, [isLoading]);

  // Define how many skeleton cards you want to show
  const NUMBER_OF_SKELETON_CARDS = 5;
  const skeletonCards = Array.from({ length: NUMBER_OF_SKELETON_CARDS }).map(
    (_, idx) => (
      <div
        key={`skeleton-${idx}`}
        className={cn(
          'relative group block p-2 w-full min-w-xs',
          // Default to one column, then apply specific spanning for the last items
          // This ensures all skeletons get a grid cell.
          idx === NUMBER_OF_SKELETON_CARDS - 2
            ? 'md:col-span-1 lg:col-span-1'
            : idx === NUMBER_OF_SKELETON_CARDS - 1
            ? 'md:col-span-2 lg:col-span-2'
            : 'md:col-span-1 lg:col-span-1' // Explicitly set default to 1 column
        )}
      >
        <Card className=" flex flex-col justify-between min-h-96 md:min-h-[500px] h-full">
          {/* Skeleton for CardTitle */}
          <div className="flex flex-col gap-12">
            <div>
              <Skeleton className="h-6 w-3/4 mb-4 rounded-md" />
              {/* Skeleton for CardDescription */}
              <Skeleton className="h-4 w-full mb-2 rounded-md" />
              <Skeleton className="h-4 w-5/6 mb-4 rounded-md" />
            </div>

            {/* Skeletons for bulletPoints */}
            <div className="space-y-2 mt-auto">
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-5/6 rounded-md" />
              <Skeleton className="h-3 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
            </div>
          </div>

          {/* Skeleton for Button */}
          <Skeleton className="h-10 w-full mt-4 rounded-md" />
        </Card>
      </div>
    )
  );

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3',
        className
      )}
    >
      {/* {isLoading */}
      {isLoaded
        ? skeletonCards
        : items.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                ` relative group block p-2 w-full`,
                idx === items.length - 2
                  ? 'md:col-span-1 lg:col-span-1'
                  : idx === items.length - 1
                  ? 'md:col-span-2 lg:col-span-2'
                  : ''
              )}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.span
                    className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-white/5 block rounded-3xl"
                    layoutId="hoverBackground"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { duration: 0.15 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15, delay: 0.2 },
                    }}
                  />
                )}
              </AnimatePresence>
              <Card className="bg-background border-black/25 dark:bg-transparent">
                <div className="flex flex-col justify-between min-h-96 md:min-h-[500px] h-full">
                  <div className="flex flex-col gap-3">
                    <CardTitle className="text-foreground">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="max-w-lg md:max-w-sm md:mx-auto  text-foreground dark:text-foreground/75">
                      {item.description}
                    </CardDescription>
                  </div>
                  <ul className="space-y-1 py-12">
                    {item.bulletPoints.map((point: string, i: number) => (
                      <li
                        className={
                          idx === items.length - 1
                            ? 'text-start md:text-center'
                            : 'text-start'
                        }
                        key={i}
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                  <button
                    className=" dark:hover:bg-white dark:hover:text-background !transition-all !duration-600 hover:bg-background hover:text-foreground text-background dark:text-foreground bg-zinc-900"
                    // onClick={() => handleOpen(size, idx)}
                    onClick={() => handleDownloadClick(item.id)}
                  >
                    Read Full License
                  </button>
                  <Modal
                    placement="center"
                    backdrop="blur"
                    classNames={{
                      backdrop: 'bg-background/20 !backdrop-opacity-10',
                      closeButton: 'right-1 top-2 z-[300]',
                    }}
                    className="max-w-sm lg:max-w-3xl !overflow-auto max-h-1/2 md:max-h-4/6"
                    isOpen={isOpen}
                    size={'3xl'}
                    scrollBehavior={'inside'}
                    motionProps={{
                      variants: {
                        enter: {
                          y: 0,
                          opacity: 1,
                          transition: {
                            duration: 0.3,
                            ease: 'easeOut',
                          },
                        },
                        exit: {
                          y: -20,
                          opacity: 0,
                          transition: {
                            duration: 0.2,
                            ease: 'easeIn',
                          },
                        },
                      },
                    }}
                    onClose={onClose}
                  >
                    <ModalContent className=" flex flex-col relative z-50 w-full box-border outline-none mx-1 my-1 sm:mx-6 sm:my-16 !rounded-2xl shadow-small !overflow-y-auto max-w-4xl bg-black">
                      {(onClose) => (
                        <>
                          <div className="flex w-full sticky top-0 bg-zinc-900 z-50 py-2 px-4 border-b border-zinc-700">
                            <ModalHeader className="flex-1 text-center">
                              {selectedItemIndex !== null
                                ? items[selectedItemIndex].title
                                : ''}
                            </ModalHeader>
                          </div>
                          {/* Only render if selectedItemIndex is not null */}
                          <ModalFooter className="bg-zinc-900 border-t border-zinc-700">
                            <button
                              className="hover:bg-transparent hover:text-foreground !transition-all !duration-600 bg-foreground text-background"
                              onClick={onClose}
                            >
                              Close
                            </button>
                          </ModalFooter>
                        </>
                      )}
                    </ModalContent>
                  </Modal>
                </div>
              </Card>
            </div>
          ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl h-full w-full p-4 overflow-hidden bg-black/50 border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20',
        className
      )}
    >
      <div className="relative z-50 h-full">
        <div className="p-4 h-full flex flex-col justify-between">
          {children}
        </div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn('text-zinc-100 font-bold tracking-wide mt-4', className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        ' text-zinc-400 tracking-wide leading-relaxed text-sm',
        className
      )}
    >
      {children}
    </p>
  );
};

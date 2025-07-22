import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal';
export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
    bulletPoints: Array;
    licenseInfo: (clickTime?: Date) => string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = useState('4xl');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  ); // Add this line

  const handleOpen = (size: string, index: number) => {
    setSize(size);
    setSelectedItemIndex(index);
    onOpen();
  };

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3',
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`relative group  block p-2 w-full ${
            // If it's the second-to-last item, span 2 columns (left side)
            idx === items.length - 2
              ? 'md:col-span-1 lg:col-span-1'
              : // If it's the last item, span 1 column (right side)
              idx === items.length - 1
              ? 'md:col-span-2 lg:col-span-2'
              : ''
          }`}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-white/5 block  rounded-3xl"
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
          <Card>
            <div className="flex flex-col justify-between min-h-96 md:min-h-[500px] h-full">
              <div className="flex flex-col gap-3">
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </div>
              <ul className="space-y-1">
                {item.bulletPoints.map((point, i) => (
                  <li
                    className={
                      idx === items.length - 1
                        ? 'text-start md:text-center'
                        : 'text-start'
                    }
                    key={i}
                  >
                    {console.log(item.title)}
                    {point}
                  </li>
                ))}
              </ul>
              <button
                className="hover:bg-foreground hover:text-background  !transition-all !duration-600 bg-zinc-900"
                onClick={() => handleOpen(size, idx)}
              >
                Read Full License
              </button>
              <Modal
                placement="center"
                backdrop="blur"
                classNames={{
                  backdrop: 'bg-background/20 !backdrop-opacity-10',

                  closeButton: 'right-1 top-2 z-[300] ',
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
                <ModalContent className="flex flex-col relative z-50 w-full box-border outline-none mx-1 my-1 sm:mx-6 sm:my-16 !rounded-2xl shadow-small !overflow-y-auto max-w-4xl bg-black">
                  {(onClose) => (
                    <>
                      <div className="flex w-full sticky top-0 bg-zinc-900 z-50 py-2 px-4">
                        <ModalHeader className="flex-1 text-center">
                          {selectedItemIndex !== null
                            ? items[selectedItemIndex].title
                            : ''}
                        </ModalHeader>
                        {/* <button className="" onClick={onClose}>
                          x
                        </button> */}
                      </div>

                      {item.licenseInfo()}
                      <ModalFooter className="bg-zinc-900  !border-none">
                        <button
                          className="hover:bg-transparent hover:text-foreground  !transition-all !duration-600 bg-foreground text-background"
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
        <div className="p-4 h-full">{children}</div>
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

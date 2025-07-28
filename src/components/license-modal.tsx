import { useState } from 'react';
import { X } from 'lucide-react';
import type { Track } from '@/contexts/PlayerContext';
import { useCart } from '@/contexts/cart-context';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
// import { Accordion, AccordionItem } from '@heroui/accordion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
}

const licenseOptions = [
  {
    id: 'basic',
    name: 'Basic License',
    price: 39.99,
    features: [
      'MP3 Format',
      'Non-Exclusive Rights',
      'Up to 5,000 streams',
      '1 Music Video',
      'Basic Distribution Rights',
    ],
  },
  {
    id: 'premium',
    name: 'Premium License',
    price: 79.99,
    features: [
      'WAV + MP3 Format',
      'Non-Exclusive Rights',
      'Up to 50,000 streams',
      '5 Music Videos',
      'Full Distribution Rights',
      'Trackouts Available',
    ],
  },
  {
    id: 'exclusive',
    name: 'Exclusive License',
    price: 299.99,
    features: [
      'WAV + MP3 Format',
      'Exclusive Rights',
      'Unlimited streams',
      'Unlimited Music Videos',
      'Full Commercial Rights',
      'Trackouts Included',
      'Producer Credit Removal',
    ],
  },
];

export default function LicenseModal({
  isOpen,
  onClose,
  track,
}: LicenseModalProps) {
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [openItems, setOpenItems] = useState({});
  if (!isOpen || !track) return null;

  const handleAddToCart = () => {
    if (!selectedLicense) return;
    console.log(licenseOptions, 'licenseOption');
    console.log(track.licenses, 'track');
    console.log(selectedLicense, 'selectedLicense');
    // console.log()
    const license = track.licenses.find((l) => l.type === selectedLicense);
    if (!license) return;

    addToCart({
      id: track.id,
      title: track.title,
      artist: track.artist,
      // price: license.price,
      // return price where selected license is equal to the type in the map so we return that price
      price: track.licenses.find((l) => l.type === selectedLicense)?.price || 0,
      // license: license.name,
      license: selectedLicense,
      image: track.image || track.s3_image_url,
      key: track.key,
      bpm: track.bpm,
      duration: track.duration,
      audioUrl: track.audioUrl,
      dateAdded: track.dateAdded,
      licenses: track.licenses,
      s3_mp3_url: track.s3_mp3_url,
      s3_image_url: track.s3_image_url,
    });

    onClose();
    setSelectedLicense(null);
  };

  return (
    <>
      <Modal
        placement="center"
        backdrop="blur"
        classNames={{
          backdrop: 'bg-background/20 !backdrop-opacity-10',

          closeButton:
            'right-1 top-2 z-[5000] hover:!text-white !text-gray-300',
        }}
        className="!max-w-2xl lg:max-w-3xl !overflow-auto !max-h-4/6 md:!max-h-2/3"
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
        <ModalContent className="flex flex-col relative z-50 w-full box-border outline-none mx-1 my-1 sm:mx-6 sm:my-16 !rounded-2xl shadow-small overflow-hidden max-w-3xl bg-zinc-900">
          {(onClose) => (
            <>
              {/* <ModalHeader className="flex flex-col gap-1 !bg-white/10 text-xl font-bold text-center">
                Select License
              </ModalHeader> */}
              <div className="relative  min-h-32 flex w-full items-center pt-3  overflow-hidden border-b-2 border-foreground/5">
                <img
                  className="h-44 aspect-square object-cover"
                  src={track.image ? track.image : track.s3_image_url}
                  alt={track.artist}
                />
                <div className="!text-start">
                  <ModalHeader className="flex flex-col !font-normal text-foreground/70">
                    <p className="text-2xl font-bold text-white">
                      {track.title}
                    </p>
                    <p className=" text-lg">{track.artist} Type Beat</p>
                    <p className="font-light text-sm">
                      Key: {track.key} | {track.bpm} BPM
                    </p>
                  </ModalHeader>
                </div>
              </div>

              <ModalBody className="p-6 space-y-4 overflow-y-scroll">
                {track.licenses.map((license, index) => {
                  const accordionValue = `item-${index}`;
                  const isOpen = openItems[license.type] === accordionValue;
                  return (
                    <>
                      <div
                        key={index}
                        className={`border rounded-lg p-4 !p-2 cursor-pointer transition-colors ${
                          selectedLicense === license.type
                            ? '!border-zinc-500 !bg-green-500/10'
                            : '!border-gray-700 hover:!border-gray-600'
                        }`}
                        onClick={() => setSelectedLicense(license.type)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex flex-col">
                            <h3 className="text-lg font-semibold text-white text-start">
                              {license.type} License
                            </h3>
                            <div className="mt-1 text-start flex flex-col text-xs text-foreground/40">
                              <p>{license.features[0]}</p>
                              {index >= 2 && <p>{license.features[1]}</p>}
                            </div>
                          </div>
                          <span className="text-2xl font-bold text-green-400">
                            ${license.price}
                          </span>
                        </div>

                        <Accordion
                          type="single"
                          collapsible
                          onValueChange={(value) => {
                            setOpenItems((prev) => ({
                              ...prev,
                              [license.type]:
                                value === accordionValue ? value : '',
                            }));
                          }}
                        >
                          <AccordionItem value={accordionValue}>
                            <AccordionTrigger className="flex-row-reverse justify-end !m-0 !-ml-1 gap-2 !p-0 !font-medium !text-sm text-foreground/50">
                              {isOpen ? 'Hide usage terms' : 'Show usage terms'}
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="space-y-1">
                                {license.features.map((feature, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center text-sm text-gray-300"
                                  >
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    {feature === 'Receive Signed Contract' ? (
                                      <span>*{feature}*</span>
                                    ) : (
                                      <span>{feature}</span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </>
                  );
                })}
              </ModalBody>
              <ModalFooter className="z-50">
                <button
                  onClick={onClose}
                  className="px-6 py-2 !text-gray-300 hover:!text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedLicense}
                  className="px-6 py-2 !bg-green-700 text-foreground font-medium rounded hover:!bg-green-600 transition-colors  disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

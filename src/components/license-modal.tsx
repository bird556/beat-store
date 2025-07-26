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

  if (!isOpen || !track) return null;

  const handleAddToCart = () => {
    if (!selectedLicense) return;

    const license = licenseOptions.find((l) => l.id === selectedLicense);
    if (!license) return;

    addToCart({
      id: track.id,
      title: track.title,
      artist: track.artist,
      price: license.price,
      license: license.name,
      image: track.image,
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
                  src={track.image}
                  alt={track.artist}
                />
                <div className="!text-start">
                  <ModalHeader className="flex flex-col   !font-normal text-foreground/70">
                    <p className="text-2xl font-bold text-white">
                      {track.title}
                    </p>
                    <p className=" text-lg">{track.artist}</p>
                    <p className="font-light text-sm">
                      Key: {track.key} | {track.bpm} BPM
                    </p>
                  </ModalHeader>
                </div>
              </div>

              <ModalBody className="p-6 space-y-4 overflow-y-scroll">
                {licenseOptions.map((license) => (
                  <div
                    key={license.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedLicense === license.id
                        ? '!border-zinc-500 !bg-green-500/10'
                        : '!border-gray-700 hover:!border-gray-600'
                    }`}
                    onClick={() => setSelectedLicense(license.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white">
                        {license.name}
                      </h3>
                      <span className="text-2xl font-bold text-green-400">
                        ${license.price}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {license.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-gray-300 text-sm flex items-center"
                        >
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
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

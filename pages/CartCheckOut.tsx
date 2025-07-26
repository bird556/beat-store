import { useCart } from '@/contexts/cart-context';
import { usePlayer } from '@/contexts/PlayerContext';
import { motion } from 'framer-motion';
import { FaStripe } from 'react-icons/fa';
import { Trash2 } from 'lucide-react';
import { Play, ShoppingCart, Download, Share2, Pause } from 'lucide-react';
import { IoLogoPaypal } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
const CartCheckOut = ({ size }) => {
  const { items, removeFromCart, totalPrice, clearCart } = useCart();
  const { playTrack, currentTrack, isPlaying, setQueue, queue } = usePlayer();
  console.log(items);
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className=" max-w-6xl mx-auto px-4 py-8 z-5 !min-h-3/4 h-[60vh]"
    >
      <h2 className={` ${size} text-4xl font-bold text-start`}>Cart</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 py-8 mx-auto gap-6">
        <div className="col-span-1 lg:col-span-2 z-5">
          {/* Header */}
          <div
            className={`!z-5 grid grid-cols-10 gap-4 text-foreground text-sm font-medium  border-gray-800 pb-3 mb-4`}
          >
            <div className="!col-span-3 md:!col-span-1 !z-5 text-xl font-bold">
              Title
            </div>
            <div className="hidden md:block md:col-span-1 col-end-1 !z-5"></div>
            <div className="hidden md:block md:col-span-2"></div>
            <div className="lg:block col-end-9 md:col-end-10 lg:col-end-10 text-xl font-bold">
              Price
            </div>

            {/* <div className="col-span-5 md:col-span-2 lg:col-span-2"></div> */}
          </div>
          <div className="space-y-2 z-10">
            {items.length == 0 ? (
              <div className="text-center py-8 flex flex-col justify-center items-center gap-3">
                <p className="text-gray-400">Your Cart Is Empty...</p>
                <button
                  onClick={() => {
                    navigate('/');
                  }}
                  className="bg-zinc-900 max-w-2xl hover:bg-foreground hover:text-background !transition-colors !duration-300"
                >
                  Go Back Home
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {items.map((track) => (
                  <div className="grid grid-cols-10 gap-4 items-center">
                    <div
                      key={track.id}
                      className="!bg-transparent !p-0 hover:!border-transparent z-50 !text-start !col-span-6  flex items-center space-x-3"
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
                          <img
                            className="w-20"
                            src={track.image}
                            alt={track.title}
                          />
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
                      </button>

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
                        <div className="text-green-400 text-sm truncate">
                          {track.license}
                        </div>
                      </div>
                    </div>
                    {/* <div className="hidden md:block md:col-span-1 col-end-1 !z-5"></div> */}
                    {/* <div className="hidden md:block md:col-span-1 col-end-1 !z-5"></div> */}

                    {/* Price Per Beat */}
                    <div className="col-end-9 md:col-end-10 lg:col-end-10 text-foreground font-bold text-xl">
                      ${track.price}
                    </div>
                    <button
                      onClick={() => removeFromCart(track.id)}
                      className="text-red-400 hover:text-red-300 transition-colors col-start-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Checkout Card */}
        </div>
        <div className="mx-auto max-w-2xl lg:max-w-6xl flex flex-col gap-8 justify-between z-50 !bg-zinc-900/85 rounded-sm outline-1 !outline-white/10 p-3">
          <div className="flex flex-col gap-3">
            <div className="flex text-green-400 justify-between w-full">
              <p className="text-2xl  text-default-500 font-bold">Item Total</p>
              <p className="text-2xl text-default-500 font-bold">
                ${totalPrice}
              </p>
            </div>
            <hr className="w-full " />
          </div>

          <p className=" text-sm">
            Secure your license and download your files instantly after payment
            on this website.
            <br />A copy will also be sent to your{' '}
            <b>
              <u>email address</u>
            </b>
            .
          </p>
          <div className="w-full relative flex flex-col gap-3">
            <button className="flex items-center justify-center w-full !bg-yellow-400 !text-indigo-600 !px-4 !py-2 !rounded !font-semibold !transition-all !duration-300 hover:!bg-yellow-500">
              <IoLogoPaypal className="w-64 h-6 scale-150" />
            </button>
            <button className="flex items-center justify-center w-full !bg-indigo-600 !text-white !px-4 !py-2 !rounded !font-semibold !transition-all !duration-300 hover:!bg-indigo-700">
              <FaStripe className="w-64 h-6 scale-200" />
              {/* Pay with Stripe */}
            </button>
          </div>
          <div>
            <div className="flex flex-col gap-3">
              {' '}
              {/* Use a gap value that looks good to you, e.g., gap-2, gap-3, gap-4 */}
              {/* <p className="font-bold text-sm">Complete Your Purchase</p> */}
              {/* <p className="">
                Secure your license and download your files instantly after
                payment.
              </p> */}
              <p className="text-sm font-light">
                {' '}
                {/* Changed text-small to text-sm as it's a common Tailwind class for small text */}
                Please review your order before completing payment.
                <br />
                All purchases are final.
              </p>
            </div>

            <div className="mx-auto w-fit pt-6">
              <p className="text-sm">
                Please read our{' '}
                <button className="!p-0">
                  <u>Refund Policy</u>
                </button>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartCheckOut;

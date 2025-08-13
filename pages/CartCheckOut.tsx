// pages/CartCheckOut.tsx
import { useCart } from '@/contexts/cart-context';
import { usePlayer } from '@/contexts/PlayerContext';
import { motion } from 'framer-motion';
import { FaStripe } from 'react-icons/fa';
import { Trash2, Edit, Play, Pause } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const CartCheckOut = ({ size }: { size: string }) => {
  document.title = `Birdie Bands | Checkout`;
  const { items, removeFromCart, totalPrice } = useCart();
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load customer info from sessionStorage
  useEffect(() => {
    const savedInfo = sessionStorage.getItem('customerInfo');
    if (savedInfo) {
      try {
        setCustomerInfo(JSON.parse(savedInfo));
      } catch (e) {
        console.error('Error parsing customer info:', e);
      }
    }
  }, []);

  const handleEditInfo = () => {
    navigate('/billing');
  };

  const handleStripeCheckout = async () => {
    // Implement Stripe checkout logic here
    // console.log('Initiating Stripe checkout with:', customerInfo);
    // console.log('Items For Stripe:', items);

    if (!customerInfo) return;

    setPaymentStatus('processing');
    try {
      const cartItems = items.map((item) => ({
        beatId: item.id,
        licenseType: item.license,
        s3_image_url: item.s3_image_url,
      }));
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL_BACKEND
        }/api/stripe/create-checkout-session`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartItems, customerInfo }),
        }
      );
      const { sessionId, error } = await response.json();

      if (error) {
        setPaymentStatus('error');
        toast.error('Failed to initiate Stripe payment');
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        setPaymentStatus('error');
        toast.error('Stripe initialization failed');
        return;
      }

      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId,
      });
      if (redirectError) {
        console.error('Stripe redirect error:', redirectError);
        setPaymentStatus('error');
        toast.error('Error redirecting to Stripe checkout');
      }
    } catch (err) {
      console.error('Stripe checkout error:', err);
      setPaymentStatus('error');
    }
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className=" max-w-6xl mx-auto px-4 py-16 z-5"
    >
      <h2 className={` ${size} text-4xl font-bold text-start`}>Cart</h2>
      <div className="grid grid-cols-1 min-[1200px]:grid-cols-3 py-8 mx-auto gap-6 relative">
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
            <div className="lg:block col-end-9 md:col-end-10 lg:col-end-10 text-xl font-bold max-sm:-ml-2">
              Price
            </div>
          </div>
          <div className="space-y-2 z-10 ">
            {items.length == 0 ? (
              <div className="text-center py-8 flex flex-col justify-center items-center gap-3">
                <p className="text-gray-400">Your Cart Is Empty...</p>
                <button
                  onClick={() => {
                    navigate('/');
                  }}
                  className="!bg-zinc-900 text-white max-w-2xl hover:!bg-white hover:text-black dark:hover:!bg-foreground dark:hover:!text-background !transition-colors !duration-300"
                >
                  Go Back Home
                </button>
              </div>
            ) : (
              <div
                className={`flex flex-col gap-6 max-lg:mb-16 ${
                  items.length >= 5 ? '!overflow-y-scroll' : ''
                } lg:!max-h-[50vh]`}
              >
                {items.map((track, index) => (
                  <div
                    key={index}
                    className="border-t-[0.5px] pt-4 !border-foreground/10  grid grid-cols-10 gap-4 items-center"
                  >
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
                        className="!bg-transparent !p-0 hover:!border-transparent z-50 !text-start col-span-5 md:col-span-4 flex items-center space-x-3 cursor-pointer"
                      >
                        <div className="relative aspect-square overflow-hidden rounded cursor-pointer w-20 min-w-20 max-w-20">
                          <img
                            className="w-full h-full object-cover"
                            src={track.image ? track.image : track.s3_image_url}
                            alt={track.title}
                          />
                          <div
                            className={`cursor-pointer scale-125 absolute inset-0 !bg-black/50 !border-transparent flex items-center justify-center transition-opacity rounded ${
                              currentTrack?.id === track.id
                                ? 'opacity-100'
                                : 'opacity-0'
                            }`}
                          >
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
                        <div className="text-gray-600 dark:text-gray-300 text-sm truncate max-sm:hidden">
                          {track.artist} Type Beat
                        </div>
                        <div className=" sm:block text-gray-700 dark:text-gray-400 text-xs max-sm:hidden">
                          Key: {track.key} | {track.bpm} BPM
                        </div>
                        <button className="!bg-transparent !border-none !outline-none hover:!outline-none hover:!border-none hover:!bg-transparent !m-0 !p-0 !font-normal dark:!text-green-400 hover:!text-gray-200 !text-sm !truncate hover:underline !transition-colors !duration-300">
                          {`${
                            track.license == 'Exclusive'
                              ? `${track.license} License`
                              : `${track.license} Lease`
                          }`}
                        </button>
                      </div>
                    </div>

                    {/* Price Per Beat */}
                    <div className="col-end-9 md:col-end-10 lg:col-end-10 text-foreground font-bold text-xl max-sm:-ml-4">
                      ${track.price}
                    </div>
                    <button
                      onClick={() => removeFromCart(track.id)}
                      className="!bg-transparent !border-none !outline-none hover:!outline-none hover:!border-none hover:!bg-transparent relative !z-50 text-red-400 hover:text-red-300 transition-colors col-start-10 max-sm:!-ml-4"
                    >
                      <Trash2 className="!z-0 w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Checkout Card */}
        </div>
        <div className="mx-auto max-w-2xl lg:max-w-6xl flex flex-col gap-8 justify-between z-50 dark:!bg-zinc-900/85 rounded-sm outline-1 !outline-white/10 p-3">
          <div className="flex flex-col gap-3">
            <div className="flex text-green-400 justify-between w-full">
              <p className="text-2xl  text-default-500 font-bold">Item Total</p>
              {/* Show only decimal 2 */}
              <p className="text-2xl text-default-500 font-bold">
                ${totalPrice.toFixed(2)}
              </p>
            </div>
            <hr className="w-full " />
          </div>

          {/* <p className=" text-sm">
            Secure your license and download your files instantly after payment
            on this website.
            <br />A copy will also be sent to your{' '}
            <b>
              <u>email address</u>
            </b>
            .
          </p> */}
          {customerInfo ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center gap-3">
                <p className="text-sm">
                  Billing: {customerInfo.name} ({customerInfo.email})
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditInfo}
                  className="!bg-zinc-800 !text-background dark:!text-foreground  border-white/10 dark:hover:bg-zinc-800 "
                >
                  <Edit className="w-4 h-4 mr-2" /> Edit Info
                </Button>
              </div>
              <div className="w-full relative flex flex-col gap-3">
                {/* <Button
                  onClick={handlePaypalCheckout}
                  className="flex items-center min-h-10 justify-center w-full !bg-yellow-400 !text-indigo-600 !px-4 !py-2 !rounded !font-semibold !transition-all !duration-300 hover:!bg-yellow-500 overflow-hidden"
                >
                  <IoLogoPaypal className="max-w-full max-h-6 scale-150 mr-2" />
                  Pay with PayPal
                </Button> */}
                {paymentStatus === 'processing' && (
                  <div className="flex items-center justify-center gap-2 dark:text-yellow-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Payment...</span>
                  </div>
                )}
                <div style={{ colorScheme: 'none' }}>
                  <PayPalScriptProvider
                    options={{
                      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
                    }}
                  >
                    <PayPalButtons
                      createOrder={() =>
                        toast.promise(
                          async () => {
                            try {
                              const cartItems = items.map((item) => ({
                                beatId: item.id,
                                licenseType: item.license,
                              }));
                              const response = await fetch(
                                `${
                                  import.meta.env.VITE_API_BASE_URL_BACKEND
                                }/api/paypal/create-order`,
                                {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    cartItems,
                                    customerInfo,
                                  }),
                                }
                              );
                              const { orderId, error } = await response.json();
                              if (error) throw new Error(error);
                              return orderId;
                            } catch (err) {
                              console.error('PayPal create order error:', err);
                              setPaymentStatus('error');
                              return '';
                            }
                          },
                          {
                            loading: 'Initiating PayPal payment...',
                            success:
                              'PayPal order created! Please complete the payment.',
                            error: 'Failed to initiate PayPal payment.',
                          }
                        )
                      }
                      onApprove={(data) =>
                        toast.promise(
                          async () => {
                            try {
                              const cartItems = items.map((item) => ({
                                beatId: item.id,
                                licenseType: item.license,
                              }));
                              const response = await fetch(
                                `${
                                  import.meta.env.VITE_API_BASE_URL_BACKEND
                                }/api/paypal/capture-order`,
                                {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    orderId: data.orderID,
                                    cartItems,
                                    customerInfo,
                                  }),
                                }
                              );
                              const {
                                status,
                                orderId,
                                items: orderItems,
                                error,
                              } = await response.json();
                              if (error) throw new Error(error);
                              if (status === 'success') {
                                console.log('Order items:', orderItems); // Use orderItems here
                                navigate(`/download?orderId=${orderId}`);
                              }
                            } catch (err) {
                              console.error('PayPal capture error:', err);
                              setPaymentStatus('error');
                            }
                          },
                          {
                            loading: 'Processing your payment...',
                            success:
                              'Payment successful! Redirecting to download...',
                            error: 'Failed to process PayPal payment.',
                          }
                        )
                      }
                      onError={() => {
                        setPaymentStatus('error');
                        toast.error('An error occurred during PayPal payment.');
                      }}
                    />
                  </PayPalScriptProvider>
                </div>

                <Button
                  onClick={handleStripeCheckout}
                  disabled={paymentStatus === 'processing'}
                  className="flex items-center min-h-10 justify-center w-full !bg-indigo-600 !text-white !px-4 !py-2 !rounded !font-semibold !transition-all !duration-300 hover:!bg-indigo-700 overflow-hidden"
                >
                  <FaStripe className="max-w-full max-h-6 scale-150 mr-2" />
                  Pay with Stripe
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className=" text-sm">
                Secure your license and download your files instantly after
                payment on this website.
                <br />A copy will also be sent to your{' '}
                <b>
                  <u>email address</u>
                </b>
                .
              </p>
              <Button
                onClick={() => navigate('/billing')}
                className="w-full !bg-green-400 !text-black hover:!bg-green-500"
              >
                Proceed to Payment
              </Button>
            </>
          )}
          <div>
            <div className="flex flex-col gap-3">
              <p className="font-bold text-sm">Important Notice</p>
              <p className="text-sm ">
                By clicking the button you accept the product(s){' '}
                <Link to={'/licenses'}>
                  <b>License Agreement(s)</b>,{' '}
                </Link>
                <button className="!font-bold  !m-0 !p-0 !bg-transparent !border-none !outline-none hover:!outline-none hover:!border-none hover:!bg-transparent">
                  <Link to={'/terms-of-service'}>Terms of Service</Link>
                </button>
                ,{' '}
                <button className="!font-bold  !m-0 !p-0 !bg-transparent !border-none !outline-none hover:!outline-none hover:!border-none hover:!bg-transparent">
                  <Link to={'/privacy-policy'}>Privacy Policy</Link>
                </button>{' '}
                &{' '}
                <button className="!font-bold !m-0 !p-0 !bg-transparent !border-none !outline-none hover:!outline-none hover:!border-none hover:!bg-transparent">
                  <Link to={'/refund-policy'}>Refund Policy</Link>
                </button>
                .
              </p>
              <p className="text-sm font-light">
                Please review your order before completing payment.
                <br />
                All purchases are final.
              </p>
            </div>

            <div className="mx-auto w-fit pt-6">
              <p className="text-sm">
                Please read our{' '}
                <Link to={'/refund-policy'}>
                  <button className="!p-0 !bg-transparent !border-none !outline-none hover:!outline-none hover:!border-none hover:!bg-transparent">
                    <u>Refund Policy</u>
                  </button>
                </Link>
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

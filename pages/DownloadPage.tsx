import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, User, Tag, DownloadCloud, Music, Gavel } from 'lucide-react'; // Added Music & Gavel (or similar) for BPM/Key icons
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/cart-context';
// Updated Interface: Added bpm and key
interface PurchasedItem {
  title: string;
  artist: string;
  downloadUrl: string;
  imageUrl: string;
  licenseType: string;
  bpm: number | null; // Added bpm
  key: string | null; // Added key
}

interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: PurchasedItem[];
}

export default function DownloadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const orderId = new URLSearchParams(location.search).get('orderId');
    if (!orderId) {
      setError('No order ID provided');
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL_BACKEND
          }/download?orderId=${orderId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setOrder(data);
        }
        clearCart();
      } catch (err) {
        console.error('Fetch order error:', err);
        setError('Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [location]);

  return (
    <div className="z-50 relative max-w-6xl mx-auto px-4 py-16 min-h-[60vh] flex flex-col justify-center items-center">
      <h2 className="text-5xl font-extrabold text-center text-foreground mb-8 animate-fade-in-up">
        Your Downloads Are Ready!
      </h2>
      {error ? (
        <div className="text-center py-8 px-4 w-full">
          <Card className="max-w-md mx-auto bg-card text-card-foreground shadow-lg">
            <CardHeader>
              <CardTitle className="text-red-500 text-3xl font-bold">
                Oops!
              </CardTitle>
              <CardDescription className="text-md mt-2">
                Something went wrong.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-red-400 font-medium">{error}</p>
              <p className="text-sm dark:text-muted-foreground mt-2">
                Please verify your link or contact support if the issue
                persists.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={() => navigate('/')}
                className="mt-4 bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                Go to Homepage
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : isLoading ? (
        <div className="py-8 w-full space-y-6">
          <Card className="border-none bg-card/0 text-card-foreground shadow-lg">
            <CardHeader>
              <Skeleton className="h-8 w-2/3 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />

              <Skeleton className="h-7 w-1/3 mt-8" />
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card
                    key={i}
                    className=" flex flex-col md:flex-row items-center p-4 gap-4 bg-muted/0 border-t-0 border-l-0 border-r-0 !border-b-[1px] rounded-none"
                  >
                    <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
                    <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      {/* Skeletons for BPM and Key */}
                      <Skeleton className="h-4 w-1/4" /> {/* BPM */}
                      <Skeleton className="h-4 w-1/4" /> {/* Key */}
                      <Skeleton className="h-4 w-1/3" /> {/* License Type */}
                    </div>
                    <Skeleton className="h-12 w-28 rounded-md" />
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : order ? (
        <div className="py-8 w-full">
          <Card className="bg-card/0 border-none text-card-foreground shadow-lg">
            <CardHeader>
              <CardTitle className="text-green-500 text-3xl font-bold">
                Purchase Successful!
              </CardTitle>
              <CardDescription className="mt-2 text-lg">
                Thank you for your purchase. Here are your order details and
                download links.
                <br />
                <span className="text-sm text-red-500 dark:text-yellow-300">
                  Please note: These download links are active for 7 days.
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex  flex-col items-center gap-2">
                <p className="text-foreground text-md flex items-center gap-2">
                  <span className="font-semibold text-muted-foreground">
                    Order ID:
                  </span>
                  <span className="truncate">{order.orderId}</span>
                </p>
                <p className="text-foreground text-md flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-muted-foreground">
                    Customer:
                  </span>
                  <span className="truncate">{order.customerName}</span>
                </p>
                <p className="text-foreground text-md flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-muted-foreground">
                    Email:
                  </span>
                  <span className="truncate">{order.customerEmail}</span>
                </p>
              </div>

              <p className="text-muted-foreground mt-4">
                A detailed purchase receipt, license agreement and additional
                download instructions have been sent to{' '}
                <span className="font-semibold text-primary">
                  {order.customerEmail}
                </span>
                .
              </p>

              <h4 className="text-2xl font-semibold text-foreground mt-8 border-b pb-2">
                Your Purchased Beats:
              </h4>
              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <Card
                    key={index}
                    className="flex flex-col md:flex-row items-center p-4 gap-4 bg-muted/0 border-t-0 border-l-0 border-r-0 !border-b-[1px] rounded-none"
                  >
                    <img
                      className="w-24 h-24 object-cover aspect-square rounded-lg shadow-md flex-shrink-0"
                      src={item.imageUrl || '/placeholder-beat.png'}
                      alt={item.title}
                    />
                    <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left">
                      <p className="text-foreground font-bold text-lg">
                        {item.title}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {item.artist} Type Beat
                      </p>
                      <div className="flex flex-wrap max-sm:!flex-col items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Tag className="w-4 h-4 text-primary" />
                          <span className="text-green-400">
                            {item.licenseType}{' '}
                            {item.licenseType === 'Exclusive'
                              ? 'License'
                              : 'Lease'}
                          </span>
                        </span>
                        {/* ADDED: BPM and Key display */}
                        {item.bpm && (
                          <span className="flex items-center gap-1">
                            <Music className="w-4 h-4 text-primary" />
                            <span>BPM: {item.bpm}</span>
                          </span>
                        )}
                        {item.key && (
                          <span className="flex items-center gap-1">
                            <Gavel className="w-4 h-4 text-primary" />{' '}
                            {/* Or another appropriate icon */}
                            <span>Key: {item.key}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <a
                      href={item.downloadUrl}
                      download
                      className=" flex items-center gap-2 !text-green-400 !text-sm hover:!underline !bg-zinc-900/80 hover:!bg-zinc-700/50 !py-3 !px-4 rounded-md transition-colors whitespace-nowrap"
                    >
                      <DownloadCloud className="w-4 h-4" />
                      Download
                    </a>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-6">
              <button
                onClick={() => navigate('/')}
                className="bg-black text-white hover:bg-white hover:text-black dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 transition-colors"
              >
                Back to Home
              </button>
            </CardFooter>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

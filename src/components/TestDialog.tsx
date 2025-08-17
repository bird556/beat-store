import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/theme-provider';
import { toast } from 'react-hot-toast';
import { Input } from './ui/input';
import { Link } from 'react-router-dom';
const TestDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    console.log('TestDialog mounted');
    const timer = setTimeout(() => {
      console.log('Opening TestDialog after 5 seconds');
      setIsOpen(true);
    }, 1000);

    return () => {
      console.log('TestDialog unmounted or timer cleared');
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, email, agreed };
    console.log('Sending:', payload);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Subscribed successfully!', {
        style: {
          background: theme === 'dark' ? '#333 !important' : '#fff !important',
          color: theme === 'dark' ? '#fff !important' : '#333 !important',
        },
      });
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={`sm:max-w-[525px] ${
          theme === 'dark'
            ? 'bg-black !important text-white !important'
            : 'bg-white !important text-gray-900 !important'
        } border-0 !important shadow-lg !important rounded-lg !important`}
      >
        <DialogHeader>
          <DialogTitle
            className={`text-3xl pt-6 text-center !important font-bold ${
              theme === 'dark'
                ? 'text-white !important'
                : 'text-gray-900 !important'
            }`}
          >
            Exclusive Beat Drops
          </DialogTitle>
          <DialogDescription
            className={`!text-2xl pb-6 text-center !font-bold !important ${
              theme === 'dark'
                ? 'text-white !important'
                : 'text-black !important'
            }`}
          >
            Be the First to Drop New Beats!
          </DialogDescription>
          <DialogDescription
            className={`text-md text-center ${
              theme === 'dark'
                ? 'text-gray-300 !important'
                : 'text-gray-600 !important'
            }`}
          >
            Get exclusive notifications about the latest type beats and
            instrumentals from Birdie Bands.
            <br />
            Don’t miss out
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              const capitalized = e.target.value
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              setName(capitalized);
            }}
            required
            className={`w-full p-3 !important border !important rounded-lg !important ${
              theme === 'dark'
                ? 'bg-zinc-700 !important border-gray-600 !important text-white !important'
                : 'bg-white !important border-gray-300 !important text-gray-900 !important'
            } focus:outline-none !important focus:ring-2 !important focus:ring-blue-500 !important`}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full p-3 !important border !important rounded-lg !important ${
              theme === 'dark'
                ? 'bg-zinc-700 !important border-gray-600 !important text-white !important'
                : 'bg-white !important border-gray-300 !important text-gray-900 !important'
            } focus:outline-none !important focus:ring-2 !important focus:ring-blue-500 !important`}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="newsletter"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
              className={
                theme === 'dark'
                  ? 'accent-blue-500 !important'
                  : 'accent-blue-600 !important'
              }
            />
            <label
              htmlFor="newsletter"
              className={`text-base ${
                theme === 'dark'
                  ? 'text-gray-300 !important'
                  : 'text-gray-600 !important'
              }`}
            >
              I agree to receive newsletters and updates from Birdie Bands
            </label>
          </div>
          <label
            htmlFor="newsletter"
            className={`text-base ${
              theme === 'dark'
                ? 'text-gray-300 !important'
                : 'text-gray-600 !important'
            }`}
          >
            By signing up, you agree to our{' '}
            <Link to={'/terms-of-service'}>Terms of Service</Link>.
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 !important rounded-lg !important !transition-colors !duration-500 ${
              theme === 'dark'
                ? 'bg-white text-black !important hover:bg-black hover:text-white'
                : 'bg-black text-white !important hover:bg-white hover:text-black'
            } transition-colors !important disabled:opacity-50 !important`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin !important" />
                Subscribing...
              </span>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TestDialog;

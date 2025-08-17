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

const POPUP_STORAGE_KEY = 'mailerlite_popup_shown_at';

const MailerLitePopUp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // console.log('TestDialog mounted');
    const lastShown = localStorage.getItem(POPUP_STORAGE_KEY);
    const oneWeekInMs = 3 * 24 * 60 * 60 * 1000;

    if (!lastShown || Date.now() - parseInt(lastShown, 10) > oneWeekInMs) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const payload = { name, email, agreed };
    // console.log('Sending:', payload);
    setIsSubmitting(true);

    toast.promise(
      fetch(
        `${import.meta.env.VITE_API_BASE_URL_BACKEND}/api/mailerlite/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            setIsSubmitting(false);
            throw new Error('Subscription failed');
          }
          return response.json();
        })
        .then((data) => {
          // console.log('Subscription successful:', data);
          setIsSubmitting(false);
          setIsOpen(false); // Close modal on success
          return data;
        }),
      {
        loading: 'Subscribing...',
        success: (data) => data.message || 'Subscribed successfully!',
        error: (error) =>
          error.message || 'An error occurred. Please try again.',
      },
      {
        style: {
          background: theme === 'dark' ? '#333' : '#fff',
          color: theme === 'dark' ? '#fff' : '#333',
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={`max-w-[90vw] sm:max-w-[525px] px-4 sm:px-6 py-6 ${
          theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-gray-900'
        } border-0 shadow-lg rounded-lg`}
      >
        <DialogHeader>
          <DialogTitle
            className={`[@media(max-height:850px)]:!text-sm text-3xl pt-6 text-center  font-bold ${
              theme === 'dark' ? 'text-white ' : 'text-gray-900 '
            }`}
          >
            Exclusive Beat Drops
          </DialogTitle>
          <DialogDescription
            className={`[@media(max-height:850px)]:!text-sm [@media(max-height:850px)]:!hidden flex items-center justify-center  !text-2xl pb-6 text-center !font-bold  ${
              theme === 'dark' ? 'text-white ' : 'text-black '
            }`}
          >
            Unlock the Latest Beat Releases{' '}
            <picture className="pointer-events-none">
              <source
                srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp"
                type="image/webp"
              />
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.gif"
                alt="🔥"
                width="32"
                height="32"
                className="max-sm:hidden"
              />
            </picture>{' '}
          </DialogDescription>
          <DialogDescription
            className={`[@media(max-height:850px)]:!text-sm text-md text-center ${
              theme === 'dark' ? 'text-gray-300 ' : 'text-gray-600 '
            }`}
          >
            Get Exclusive Access to Birdie Bands' Latest Releases
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
            className={`w-full p-3  border  rounded-lg  ${
              theme === 'dark'
                ? 'bg-zinc-700  border-gray-600  text-white '
                : 'bg-white  border-gray-300  text-gray-900 '
            } focus:outline-none  focus:ring-2  focus:ring-blue-500 `}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full p-3  border  rounded-lg  ${
              theme === 'dark'
                ? 'bg-zinc-700  border-gray-600  text-white '
                : 'bg-white  border-gray-300  text-gray-900 '
            } focus:outline-none  focus:ring-2  focus:ring-blue-500 `}
          />
          <div className="flex items-center justify-center gap-2">
            <input
              type="checkbox"
              id="newsletter"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
              className={
                theme === 'dark' ? 'accent-blue-500 ' : 'accent-blue-600 '
              }
            />
            <label
              htmlFor="newsletter"
              className={`[@media(max-height:850px)]:!text-sm text-sm !font-bold ${
                theme === 'dark' ? 'text-gray-300 ' : 'text-gray-600 '
              }`}
            >
              I agree to receive newsletters and updates from Birdie Bands
            </label>
          </div>
          <label
            htmlFor="newsletter"
            className={`[@media(max-height:850px)]:!text-sm text-base ${
              theme === 'dark' ? 'text-gray-300 ' : 'text-gray-600 '
            }`}
          >
            By signing up, you agree to our{' '}
            <Link to={'/terms-of-service'}>Terms of Service</Link>.
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`[@media(max-height:850px)]:!py-2 w-full py-3  rounded-lg  !transition-colors !duration-500 ${
              theme === 'dark'
                ? 'bg-white text-black  hover:bg-transparent hover:!outline-1 hover:!outline-white hover:text-white disabled:bg-white disabled:text-black disabled:cursor-not-allowed'
                : 'bg-black text-white  hover:bg-white hover:text-black disabled:bg-black disabled:text-white disabled:cursor-not-allowed'
            } transition-colors   `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin " />
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

export default MailerLitePopUp;

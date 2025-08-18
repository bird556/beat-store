// src/components/MailerLitePopUpDownload.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/contexts/theme-provider';
import { toast } from 'react-hot-toast';
import { Input } from './ui/input';
import { Link } from 'react-router-dom';

interface MailerLitePopUpDownloadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const MailerLitePopUpDownload = ({
  open,
  onOpenChange,
  onSuccess,
}: MailerLitePopUpDownloadProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          onOpenChange(false); // Close modal on success
          localStorage.setItem('mailerlite_subscribed_for_downloads', 'true');
          onSuccess?.();
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-[90vw] sm:max-w-[525px] px-4 sm:px-6 py-6 ${
          theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-gray-900'
        } border-0 shadow-lg rounded-lg`}
      >
        <DialogHeader>
          <DialogTitle
            className={`[@media(max-height:850px)]:!text-sm text-xl pt-6 text-center  font-bold ${
              theme === 'dark' ? 'text-white ' : 'text-gray-900 '
            }`}
          >
            Email & Name Is Required to Download
          </DialogTitle>

          <DialogDescription
            className={` [@media(max-height:850px)]:!text-sm text-md text-center ${
              theme === 'dark' ? 'text-gray-300 ' : 'text-gray-600 '
            }`}
          >
            <div className="flex items-center justify-center">
              Exclusive Access to Birdie Bands' Latest Releases{' '}
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
            </div>
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

export default MailerLitePopUpDownload;

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Helmet } from 'react-helmet';
import BirdieLogo from '../Images/birdie2025-logo.png'; // Adjust path as needed
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/theme-provider';

const NewsLetterSignUp = ({ fullscreen }: { fullscreen?: boolean }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { theme } = useTheme();

  document.title = `Birdie Bands | Newsletter Signup`;

  const baseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
  const canonicalUrl = `${baseUrl}/newsletter`;
  const title = 'Newsletter Signup | Birdie Bands';
  const description =
    'Join the Birdie Bands newsletter for exclusive access to new type beats, music production tips, and special offers.';
  const keywords =
    'newsletter, music production, type beats, Birdie Bands, exclusive beats, music updates';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toastPromise = toast.promise(
      fetch(
        `${import.meta.env.VITE_API_BASE_URL_BACKEND}/api/mailerlite/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email }),
        }
      ).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Subscription failed');
        return data;
      }),
      {
        loading: 'Subscribing...',
        success: 'Subscribed successfully!',
        error: 'Failed to subscribe. Please try again.',
      },
      {
        style: {
          background: theme === 'dark' ? '#333' : '#fff',
          color: theme === 'dark' ? '#fff' : '#333',
        },
      }
    );

    try {
      await toastPromise;
      setSubscribed(true);
      setName('');
      setEmail('');
      setAgreed(false);
      localStorage.setItem('mailerlite_subscribed_for_downloads', 'true');
      setTimeout(() => setSubscribed(false), 6000);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (subscribed) {
    return (
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`z-50 h-screen relative pb-48 shadow-input mx-auto w-full max-w-md rounded-none bg-transparent px-4 md:rounded-2xl md:px-8 ${
          fullscreen ? 'h-screen' : ''
        } flex flex-col gap-4 justify-center`}
      >
        <div className="py-16 rounded-2xl">
          <h1 className="!text-2xl font-bold mb-4">Thanks for Subscribing!</h1>
          <button
            onClick={() => setSubscribed(false)}
            className="bg-foreground text-background hover:bg-green-700 hover:text-foreground !transition-colors !duration-300 px-4 py-2 rounded-md"
          >
            Sign Up Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={BirdieLogo} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Birdie Bands" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={BirdieLogo} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            url: canonicalUrl,
            name: title,
            description: description,
            publisher: {
              '@type': 'Organization',
              name: 'Birdie Bands',
              logo: {
                '@type': 'ImageObject',
                url: BirdieLogo,
              },
            },
          })}
        </script>
      </Helmet>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`z-50 relative my-16 !shadow-none mx-auto w-full max-w-md rounded-none bg-transparent px-4 md:rounded-2xl md:px-8 ${
          fullscreen ? '' : ''
        } flex flex-col gap-4 justify-center`}
      >
        <h2 className="font-bold text-2xl">Join Our Newsletter</h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Get exclusive access to new type beats, production tips, and special
          offers from Birdie Bands.
        </p>

        <form className="my-8 !text-start" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your Name"
              type="text"
              value={name}
              onChange={(e) => {
                const capitalized = e.target.value
                  .split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                setName(capitalized);
              }}
              required
              className={`w-full p-3 border rounded-lg ${
                theme === 'dark'
                  ? 'bg-zinc-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="your.email@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full p-3 border rounded-lg ${
                theme === 'dark'
                  ? 'bg-zinc-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <div className="flex items-center justify-start gap-2">
              <input
                type="checkbox"
                id="newsletter"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
                className={
                  theme === 'dark' ? 'accent-blue-500' : 'accent-blue-600'
                }
              />
              <Label
                htmlFor="newsletter"
                className={`text-sm !font-bold ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                I agree to receive newsletters and updates from Birdie Bands
              </Label>
            </div>
            <Label
              htmlFor="newsletter"
              className={`text-base mt-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              By signing up, you agree to our{' '}
              <Link to="/terms-of-service">Terms of Service</Link>.
            </Label>
          </LabelInputContainer>

          <button
            className={`group/btn relative block h-10 w-full rounded-md font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] ${
              theme === 'dark'
                ? 'bg-white text-black hover:bg-transparent hover:outline-1 hover:outline-white hover:text-white'
                : 'bg-black text-white hover:bg-white hover:text-black'
            } transition-colors disabled:bg-black disabled:text-white disabled:cursor-not-allowed dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : 'Join Now →'}
            <BottomGradient />
          </button>

          <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
        </form>
      </motion.div>
    </>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex w-full flex-col space-y-2', className)}>
      {children}
    </div>
  );
};

export default NewsLetterSignUp;

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast'; // Optional: For feedback messages
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Helmet } from 'react-helmet';
import BirdieLogo from '../Images/birdie2025-logo.png'; // Adjust path as needed
const Contact = ({ fullscreen }: { fullscreen?: boolean }) => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [truth] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  document.title = `Birdie Bands | Contact`;

  const baseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
  // const apiBaseUrl =
  //   import.meta.env.VITE_API_BASE_URL_BACKEND || 'https://api.birdiebands.com'; // Fallback API URL
  const canonicalUrl = `${baseUrl}/contact`;
  const title = 'Contact | Birdie Bands';
  const description =
    'Get in touch with Birdie Bands for inquiries about type beats, licenses, or support. Reach out via our contact form.';
  const keywords =
    'contact, music production, type beats, Birdie Bands, support';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = { email, subject, message };
    console.log('Sending:', payload);

    const toastPromise = toast.promise(
      fetch(`${import.meta.env.VITE_API_BASE_URL_BACKEND}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to send email');
        return data;
      }),
      {
        loading: 'Sending your message...',
        success: 'Email sent successfully!',
        error: 'Failed to send email. Please try again.',
      }
    );

    setIsSubmitting(true);
    try {
      await toastPromise;

      setSent(true);
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSent(false), 6000);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (truth) return <h1>Contact</h1>;
  if (sent)
    return (
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`z-50 relative pb-48 shadow-input mx-auto w-full max-w-md rounded-none bg-transparent px-4 md:rounded-2xl md:px-8 ${
          fullscreen ? 'h-screen' : ''
        } flex flex-col gap-4 justify-center`}
      >
        <div className="py-16 rounded-2xl">
          <h1 className="!text-2xl font-bold mb-4">Thanks for your message</h1>
          <button
            onClick={() => setSent(false)}
            className="bg-foreground text-background hover:bg-green-700 hover:text-foreground !transition-colors !duration-300"
          >
            Send Another Message
          </button>
        </div>
      </motion.div>
    );

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
            '@type': 'ContactPage',
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
        className={`z-50 relative my-16  !shadow-none mx-auto w-full max-w-md rounded-none bg-transparent px-4 md:rounded-2xl md:px-8 ${
          fullscreen ? '' : ''
        } flex flex-col gap-4 justify-center`}
      >
        <h2 className="font-bold text-2xl">Contact</h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Reach Out If You Have Any Inquires
        </p>

        <form className="my-8 !text-start" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="rapper_buybeats@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="subject">Subject</Label>
            <Input
              className="shadow-input dark:placeholder-text-neutral-600 flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600"
              id="subject"
              placeholder="Subject?"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="message">Message</Label>
            <textarea
              className="shadow-input dark:placeholder-text-neutral-600 flex w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600"
              id="message"
              placeholder="Write Message Here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Email →'}
            <BottomGradient />
          </button>

          <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
        </form>
      </motion.div>
    </>
  );
};

export default Contact;

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

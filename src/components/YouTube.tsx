import { FaYoutube } from 'react-icons/fa';
import BirdieLogo from '../../src/Images/1LOGO-CROP-NOSTARS.png';
const YoutubeSection = () => {
  return (
    <section className="bg-gradient-to-r from-zinc-950/0 via-zinc-900/0 to-zinc-950/0 text-white px-6">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex flex-col items-center space-y-6">
          <FaYoutube className="text-red-600 text-6xl" />
          <h2 className="text-foreground flex items-center gap-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
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
            Subscribe to Birdie Bands
          </h2>
          <div>
            <img
              className="w-32 h-32 rounded-full pointer-events-none"
              src={BirdieLogo}
              alt="bidie logo"
            />
          </div>
          {/* Subscriber Count */}
          <div className="!text-black dark:!text-gray-300 text-lg font-medium">
            🎧 Join{' '}
            <span className="dark:!text-white font-semibold">115,000+</span>{' '}
            subscribers
          </div>
          <p className="text-lg !text-black dark:!text-gray-100 max-w-xl">
            Get exclusive beat drops, studio sessions, and behind-the-scenes
            vibes straight from the channel.
          </p>
          <a
            href="https://www.youtube.com/@BIRDIE-BANDS?sub_confirmation=1" // Replace with your actual channel link
            // href="https://www.youtube.com/@BIRDIEBANDS" // Replace with your actual channel link
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-md !text-white font-semibold py-3 px-6 hover:!bg-white hover:!text-foreground  dark:hover:bg-foreground dark:hover:!text-background  !transition-all !duration-600 !bg-zinc-900"
          >
            {/* 🚀 Visit & Subscribe */}
            <picture className="pointer-events-none">
              <source
                srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.webp"
                type="image/webp"
              />
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.gif"
                alt="🚀"
                width="32"
                height="32"
              />
            </picture>
            Visit & Subscribe
          </a>
        </div>
      </div>
    </section>
  );
};

export default YoutubeSection;

import { FaYoutube } from 'react-icons/fa';
import BirdieLogo from '/src/Images/birdie2025-logo.png';
const YoutubeSection = () => {
  return (
    <section className="bg-gradient-to-r from-zinc-950/0 via-zinc-900/0 to-zinc-950/0 text-white px-6">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex flex-col items-center space-y-6">
          <FaYoutube className="text-red-600 text-6xl" />
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            🔥 Subscribe to Birdie Bands
          </h2>
          <div>
            <img
              className="w-32 h-32 rounded-full"
              src={BirdieLogo}
              alt="bidie logo"
            />
          </div>
          {/* Subscriber Count */}
          <div className="text-gray-400 text-lg font-medium">
            🎧 Join <span className="text-white font-semibold">115,000+</span>{' '}
            subscribers
          </div>
          <p className="text-lg text-gray-300 max-w-xl">
            Get exclusive beat drops, studio sessions, and behind-the-scenes
            vibes straight from the channel.
          </p>
          <a
            href="https://www.youtube.com/@BIRDIEBANDS" // Replace with your actual channel link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md !text-white font-semibold py-3 px-6  hover:bg-foreground hover:!text-background  !transition-all !duration-600 bg-zinc-900"
          >
            🚀 Visit & Subscribe
          </a>
        </div>
      </div>
    </section>
  );
};

export default YoutubeSection;

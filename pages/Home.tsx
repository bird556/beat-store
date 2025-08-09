import Artists from '@/components/Artists';
import FAQS from '@/components/FAQS';
import Licenses from '@/components/Licenses';
import TrackListing from '@/components/track-listing';
import { MoveUp } from 'lucide-react';
// import Particles from '@/components/ui/ReactBits/Particles';
// import Background from '@/components/Background';
import { useEffect, useState } from 'react';
import Contact from '@/components/Contact';
import YoutubeSection from '@/components/YouTube';
const Home = ({ size }) => {
  document.title = `Birdie Bands | Home`;
  const [searchTerm, setSearchTerm] = useState('');
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll position
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate 90% of the page height
      const ninetyPercentHeight = 0.9 * documentHeight;

      // Show button if scrolled past 90% of the page
      setShowButton(scrollPosition + windowHeight >= ninetyPercentHeight);
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="overflow-x-hidden flex flex-col gap-64 relative">
      <TrackListing
        limitTrackCount={50}
        // searchTerm={searchTerm}
        // setSearchTerm={setSearchTerm}
      />
      <Artists size={size} setSearchTerm={setSearchTerm} />
      <Licenses />
      <FAQS size={size} />
      {/* <Contact fullscreen={false} /> */}
      {showButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="z-50 fixed bottom-35 lg:right-20 right-5 transition-all duration-300 transform"
        >
          <MoveUp />
        </button>
      )}
      <YoutubeSection />
    </div>
  );
};

export default Home;

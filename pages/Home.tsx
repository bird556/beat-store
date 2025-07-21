import Artists from '@/components/Artists';
import FAQS from '@/components/FAQS';
import Licenses from '@/components/Licenses';
import TrackListing from '@/components/track-listing';
// import Particles from '@/components/ui/ReactBits/Particles';
// import Background from '@/components/Background';
import { useState } from 'react';
import Contact from '@/components/Contact';
const Home = ({ size }) => {
  const [searchTerm, setSearchTerm] = useState('');
  document.title = `Birdie Bands | Home`;
  return (
    <div className="flex flex-col gap-64 relative">
      <TrackListing
        limitTrackCount={true}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <Artists size={size} setSearchTerm={setSearchTerm} />
      <Licenses />
      <FAQS size={size} />
      {/* <Contact /> */}
    </div>
  );
};

export default Home;

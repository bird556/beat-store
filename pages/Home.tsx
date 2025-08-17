import Artists from '@/components/Artists';
import FAQS from '@/components/FAQS';
import Licenses from '@/components/Licenses';
import TrackListing from '@/components/track-listing';
import { MoveUp } from 'lucide-react';
import BirdieLogo from '../src/Images/cropped.png';
// import Particles from '@/components/ui/ReactBits/Particles';
// import Background from '@/components/Background';
import { Helmet } from 'react-helmet'; // Import React Helmet for SEO
import { useEffect, useState } from 'react';
import YoutubeSection from '@/components/YouTube';
// import MailerLitePopup from '@/components/MailerlitePopUp';
// import { MailerlitePopup } from '@/components/mailerlite-popup'; // Correct import
import MailerLitePopUp from '@/components/MailerlitePopUp';
const Home = ({ size }: { size: string }) => {
  document.title = `Birdie Bands | Home`;
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

  // SEO metadata
  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}/`;
  const title = 'Birdie Bands | High-Quality Type Beats & Instrumentals';
  const description =
    'Discover high-quality type beats and instrumentals for music production at Birdie Bands. Download beats, explore licenses, and create your next hit!';
  const keywords =
    'type beats, instrumentals, music production, hip hop beats, trap beats, rap beats, beat download, Birdie Bands, gfunk beats, gfunk type beats, g-funk type beats, g-funk type beat, memphis type beats';
  const imageUrl = BirdieLogo; // Use absolute URL if possible
  return (
    <div className="overflow-x-hidden flex flex-col gap-64 relative">
      {/* React Helmet for SEO */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph for social sharing */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Birdie Bands" />

        {/* Twitter Card for X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />

        {/* Structured Data (JSON-LD) for rich snippets */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            url: canonicalUrl,
            name: 'Birdie Bands',
            description: description,
            publisher: {
              '@type': 'Organization',
              name: 'Birdie Bands',
              logo: {
                '@type': 'ImageObject',
                url: imageUrl,
              },
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: `${baseUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          })}
        </script>
      </Helmet>
      <MailerLitePopUp />
      <TrackListing
        limitTrackCount={50}
        // searchTerm={searchTerm}
        // setSearchTerm={setSearchTerm}
      />
      <Artists size={size} />
      <Licenses />
      <FAQS size={size} />
      {/* <Contact fullscreen={false} /> */}
      {showButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="z-50 fixed bottom-35 lg:right-20 right-5 transition-all duration-300 transform !bg-transparent"
        >
          <MoveUp />
        </button>
      )}
      <YoutubeSection />
    </div>
  );
};

export default Home;

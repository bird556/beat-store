import { HoverEffect } from './ui/card-hover-effect';
import { useLicenses } from '../contexts/LicenseContext';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import BirdieLogo from '../Images/cropped.png'; // Adjust path as needed
interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  bulletPoints: string[];
}
const Licenses = () => {
  const { licenses, loading, error } = useLicenses();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const baseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
  const canonicalUrl = `${baseUrl}/licenses`;
  const title = 'Licenses | Birdie Bands';
  const description =
    'Explore licensing options for type beats and instrumentals at Birdie Bands. Choose the right license for your music production needs.';
  const keywords =
    'music licenses, type beats, instrumentals, music production, Birdie Bands';

  useEffect(() => {
    // Once loading is false and licenses are fetched, set isInitialLoad to false
    if (!loading && licenses.length > 0) {
      setIsInitialLoad(false);
    }
  }, [loading, licenses]);

  if (error) {
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
        <div className="flex flex-col gap-12 py-12">
          <h2 className="font-bold text-2xl">Licensing Info</h2>
          <div className="max-w-lg md:max-w-6xl mx-auto px-8">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </>
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
      <div className="flex flex-col gap-12 py-12">
        <h2 className="font-bold text-2xl">Licensing Info</h2>
        <div className="max-w-lg md:max-w-6xl mx-auto px-8">
          <HoverEffect
            items={useProjects() as Project[]}
            isLoading={isInitialLoad || loading}
          />
        </div>
      </div>
    </>
  );
};

export default Licenses;

const useProjects = () => {
  const { licenses } = useLicenses();
  return licenses.map((license) => ({
    id: license._id,
    title: license.title,
    description: license.description,
    link: '#',
    bulletPoints: license.features,
  }));
};

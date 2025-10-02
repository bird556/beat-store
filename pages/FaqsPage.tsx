import { Helmet } from 'react-helmet';
import FAQS from '../src/components/FAQS';
import BirdieLogo from '../src/Images/cropped.png';
import { motion } from 'framer-motion';

const FaqsPage = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
  const canonicalUrl = `${baseUrl}/faqs`;
  const title = 'FAQs | Birdie Bands';
  const description =
    'Frequently asked questions about Birdie Bands downloadable beats, instrumentals, licensing, and music production.';
  const keywords =
    'FAQs, frequently asked questions, music production, type beats, instrumentals, Birdie Bands, beat licensing';
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
            '@type': 'FAQPage',
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col justify-center self-center"
      >
        <section className="z-50 flex flex-col gap-12 py-64">
          <h1 className="font-bold">FAQS</h1>
          <FAQS />
        </section>
      </motion.div>
    </>
  );
};

export default FaqsPage;

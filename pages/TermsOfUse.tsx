import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import BirdieLogo from '../src/Images/cropped.png';
const TermsOfUse = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
  const canonicalUrl = `${baseUrl}/terms-of-use`;
  const title = 'Terms of Use | Birdie Bands';
  const description =
    'Review the Terms of Use for Birdie Bands, outlining the lawful use of our downloadable beats and instrumentals for music production.';
  const keywords =
    'terms of use, music production, type beats, instrumentals, Birdie Bands';
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <section className="max-w-4xl mx-auto py-16 !mt-16 px-6 dark:text-white h-[100vh] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
          <article className="whitespace-pre-wrap leading-relaxed text-lg">
            By accessing Birdie Bands, you agree to use our products lawfully.
            Beats purchased are for personal or licensed use only—no resale or
            unauthorized distribution.
            <br />
            <br />
            All payments are processed securely via Stripe and PayPal.
            <br />
            <br />
            We reserve the right to adjust product offerings, prices, or
            availability without notice.
            <br />
            <br />
            Birdie Bands is not liable for misuse of our products or website. We
            strive for quality, but your use is at your own risk.
            <br />
            <br />
            Last updated: July 29, 2025
          </article>
        </section>
      </motion.div>
    </>
  );
};

export default TermsOfUse;

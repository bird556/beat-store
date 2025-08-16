import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import BirdieLogo from '../src/Images/cropped.png';
const RefundPolicy: React.FC = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
  const canonicalUrl = `${baseUrl}/refund-policy`;
  const title = 'Refund Policy | Birdie Bands';
  const description =
    'Understand Birdie Bands’ refund policy for downloadable digital products like type beats and instrumentals. Learn about exceptions for refunds.';
  const keywords =
    'refund policy, music production, type beats, digital products, Birdie Bands';
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
        <section className="relative z-50 max-w-4xl mx-auto py-16 px-6 dark:text-white flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-12">Refund Policy</h1>
          <article className="text-lg flex flex-col gap-4">
            <p className="mb-4 dark:text-white">
              <strong className="dark:text-white">All sales are final.</strong>
              <br />
              Birdie Bands offers{' '}
              <strong>downloadable digital products only</strong>—including beat
              packs, stem kits, and instrumentals. These goods are delivered
              electronically and cannot be returned, so we do{' '}
              <strong>not</strong> offer refunds or cancellations after
              purchase.
            </p>
            <ul className="list-none list-inside dark:text-white space-y-2 mb-6">
              <li>
                You’re purchasing <em>intangible, irrevocable digital files</em>
                .
              </li>
              <li>No refunds are issued once files are delivered.</li>
              <li>
                You’ve previewed demos and product details before purchasing.
              </li>
            </ul>
            <div>
              <div>
                <h2 className="text-xl text-white font-medium mb-2">
                  Exceptions
                </h2>
                <p className="dark:text-white mb-4">
                  Refunds are <strong>only</strong> issued for:
                </p>
              </div>
              <ul className="list-none list-inside dark:text-white space-y-2 mb-6">
                <li>Duplicate transactions (charged twice)</li>
                <li>Technical issues preventing file access after purchase</li>
              </ul>

              <div className="dark:text-white flex flex-col gap-2">
                <p>Contact us for support</p>
                <ul className="flex items-center justify-center mt-2 space-y-1">
                  <Link to={'/contact'}>
                    <button className="flex items-center gap-2 w-fit hover:!bg-white hover:!text-black !text-white dark:hover:!bg-foreground dark:hover:!text-background  !transition-all !duration-600 !bg-zinc-900">
                      Contact <Mail />
                    </button>
                  </Link>
                </ul>
              </div>
            </div>
          </article>
        </section>
      </motion.div>
    </>
  );
};

export default RefundPolicy;

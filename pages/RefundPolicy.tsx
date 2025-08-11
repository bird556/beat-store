import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
const RefundPolicy: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="relative z-50 max-w-4xl mx-auto py-16 px-6 text-neutral-200 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-12">Refund Policy</h1>
        <article className="text-lg flex flex-col gap-4">
          <p className="mb-4 text-gray-300">
            <strong className="text-white">All sales are final.</strong>
            <br />
            Birdie Bands offers{' '}
            <strong>downloadable digital products only</strong>—including beat
            packs, stem kits, and instrumentals. These goods are delivered
            electronically and cannot be returned, so we do <strong>not</strong>{' '}
            offer refunds or cancellations after purchase.
          </p>
          <ul className="list-none list-inside text-gray-300 space-y-2 mb-6">
            <li>
              You’re purchasing <em>intangible, irrevocable digital files</em>.
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
              <p className="text-gray-300 mb-4">
                Refunds are <strong>only</strong> issued for:
              </p>
            </div>
            <ul className="list-none list-inside text-gray-300 space-y-2 mb-6">
              <li>Duplicate transactions (charged twice)</li>
              <li>Technical issues preventing file access after purchase</li>
            </ul>

            <div className="text-gray-300 flex flex-col gap-2">
              <p>Contact us for support</p>
              <ul className="flex items-center justify-center mt-2 space-y-1">
                <Link to={'/contact'}>
                  <button className="flex items-center gap-2 w-fit text-white hover:bg-foreground hover:text-background  !transition-all !duration-600 bg-zinc-900">
                    Contact <Mail />
                  </button>
                </Link>
              </ul>
            </div>
          </div>
        </article>
      </section>
    </motion.div>
  );
};

export default RefundPolicy;

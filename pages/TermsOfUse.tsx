import { motion } from 'framer-motion';
const TermsOfUse = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="max-w-4xl mx-auto py-16 !mt-16 px-6 dark:text-white h-[65vh] flex flex-col items-center justify-center">
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
  );
};

export default TermsOfUse;

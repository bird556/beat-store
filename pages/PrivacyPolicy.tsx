import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="max-w-4xl mx-auto py-16 my-16 px-6 text-neutral-200 h-[65vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <article className="whitespace-pre-wrap leading-relaxed text-lg">
          Birdie Bands respects your privacy. We collect personal information
          such as your name, email, shipping address, and purchase history to
          fulfill orders, provide customer support, and improve your experience.
          <br />
          <br />
          Your data is securely stored in MongoDB using encryption and access
          controls. We never sell your information. Data is shared only with
          trusted third parties like Stripe (for payments) and shipping
          services.
          <br />
          <br />
          You may access, update, or delete your personal data by contacting us.
          We use cookies to enhance your visit. By using our site, you agree to
          this policy.
          <br />
          <br />
          Last updated: July 29, 2025
        </article>
      </section>
    </motion.div>
  );
};

export default PrivacyPolicy;

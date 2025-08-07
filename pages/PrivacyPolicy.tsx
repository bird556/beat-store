import { FC } from 'react';
import { privacyPolicyContent } from '@/content/policies';
import { motion } from 'framer-motion';

const PrivacyPolicy: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="max-w-4xl mx-auto py-16 px-6 text-neutral-200 h-[65vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <article className="whitespace-pre-wrap leading-relaxed text-lg">
          {privacyPolicyContent}
        </article>
      </section>
    </motion.div>
  );
};

export default PrivacyPolicy;

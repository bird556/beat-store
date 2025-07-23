import React from 'react';
import { motion } from 'framer-motion';
const About = () => {
  document.title = `Birdie Bands | About`;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-screen flex flex-col justify-center"
    >
      About
    </motion.div>
  );
};

export default About;

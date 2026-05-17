import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Pricing from '@/components/landing/Pricing';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

const Index = () => {
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: { opacity: 0 },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div 
      className="min-h-screen"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
    >
      <motion.div variants={sectionVariants}>
        <Navbar />
      </motion.div>
      <motion.div variants={sectionVariants}>
        <Hero />
      </motion.div>
      <motion.div variants={sectionVariants}>
        <Features />
      </motion.div>
      <motion.div variants={sectionVariants}>
        <HowItWorks />
      </motion.div>
      <motion.div variants={sectionVariants}>
        <Pricing />
      </motion.div>
      <motion.div variants={sectionVariants}>
        <CTA />
      </motion.div>
      <motion.div variants={sectionVariants}>
        <Footer />
      </motion.div>
    </motion.div>
  );
};

export default Index;

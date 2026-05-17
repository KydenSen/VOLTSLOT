import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, MapPin, Battery, Clock } from 'lucide-react';
import heroBg from '@/assets/hero-bg.png';

const Hero = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7 },
    },
  };

  const floatVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7 },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Gradient background - dark green glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-background" />
      <motion.div 
        className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px]"
        animate={{ 
          x: [0, 30, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px]"
        animate={{ 
          x: [0, -30, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-4 w-4" />
            </motion.div>
            Smart EV Charging Platform
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1]"
            variants={itemVariants}
          >
            Book EV charging slots{' '}
            <motion.span 
              className="text-primary"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              without waiting
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed"
            variants={itemVariants}
          >
            Smart scheduling and load management for apartments, offices, and fleet operators. Zero queues, maximum efficiency.
          </motion.p>
          
          <motion.div 
            className="mt-8 flex flex-wrap gap-4"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg px-8 rounded-xl shadow-lg shadow-primary/25 font-bold"
                onClick={() => navigate('/auth')}
              >
                Book Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 rounded-xl border-border" 
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                See How It Works
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="mt-10 flex items-center gap-8"
            variants={itemVariants}
          >
            {[
              { icon: MapPin, value: '14', label: 'Stations' },
              { icon: Battery, value: '35', label: 'Chargers' },
              { icon: Clock, value: '99%', label: 'Uptime' },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="flex items-center gap-2.5"
                variants={floatVariants}
                custom={index}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <motion.div 
                  className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"
                  whileHover={{ rotate: 360, backgroundColor: "hsl(var(--primary))" }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="h-4 w-4 text-primary" />
                </motion.div>
                <div>
                  <p className="text-lg font-extrabold text-foreground">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -30 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:block"
        >
          <motion.div
            className="relative"
            animate={{ 
              y: [0, -20, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl" />
            <motion.img 
              src={heroBg} 
              alt="VoltSlot Dashboard Preview" 
              className="relative rounded-2xl shadow-2xl border border-border"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

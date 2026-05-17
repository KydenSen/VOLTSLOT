import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, CalendarDays, BatteryCharging } from 'lucide-react';

const steps = [
  { icon: UserPlus, title: 'Sign Up', desc: 'Create your account in seconds. No credit card required.' },
  { icon: CalendarDays, title: 'Book a Slot', desc: 'Pick a date, time, and charger that works for you.' },
  { icon: BatteryCharging, title: 'Charge Up', desc: 'Show up at your reserved time and plug in. Zero waiting.' },
];

const HowItWorks = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1,
      transition: { duration: 0.8, ease: "easeInOut" }
    },
  };

  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            How it{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              works
            </span>
          </h2>
          <motion.p 
            className="mt-4 text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Three simple steps to hassle-free EV charging.
          </motion.p>
        </motion.div>
        
        <div className="relative max-w-5xl mx-auto mt-20">
          {/* Connector line */}
          <motion.div 
            className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 origin-left rounded-full z-0"
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          />
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-12 relative z-10"
          >
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                variants={itemVariants}
                className="text-center flex flex-col items-center group"
                whileHover={{ y: -10 }}
              >
                {/* Step icon circle */}
                <motion.div 
                  className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center mb-6 relative shadow-lg shadow-primary/5 transition-colors group-hover:border-primary/50 group-hover:bg-primary/5"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                  >
                    <s.icon className="h-8 w-8 text-primary" />
                  </motion.div>
                  
                  {/* Step number badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md">
                    {i + 1}
                  </div>
                </motion.div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {s.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed max-w-xs">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const tiers = [
  {
    name: 'Normal Charging',
    price: '₹2',
    period: '/min',
    desc: 'Perfect for regular top-ups and long parking',
    features: ['7.4 kW AC Power', 'Widespread availability', 'Flexible durations', 'Standard support'],
    cta: 'Book Normal Slot',
    highlight: false,
  },
  {
    name: 'Fast Charging',
    price: '₹5',
    period: '/min',
    desc: 'Get back on the road in minutes, not hours',
    features: ['50 kW DC Power', 'Rapid charging capability', 'Zero waiting times', 'Priority 24/7 support'],
    cta: 'Book Fast Slot',
    highlight: true,
  }
];

const Pricing = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            Simple,{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              transparent pricing
            </span>
          </h2>
          <motion.p 
            className="mt-4 text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Pay only for the time you charge. No hidden fees.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <Card
                className={`h-full rounded-2xl transition-all duration-300 overflow-hidden ${
                  t.highlight
                    ? 'border-2 border-primary shadow-xl shadow-primary/20 relative'
                    : 'border shadow-lg'
                }`}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {t.highlight && (
                  <motion.div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold"
                    animate={{ 
                      y: [0, -5, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity
                    }}
                  >
                    Most Popular
                  </motion.div>
                )}
                
                <CardHeader className="pb-2 pt-8 relative z-10">
                  <CardTitle className="text-lg">{t.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">{t.desc}</p>
                  
                  <motion.div 
                    className="mt-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.span 
                      className="text-4xl font-extrabold"
                      animate={{ 
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    >
                      {t.price}
                    </motion.span>
                    <span className="text-muted-foreground">{t.period}</span>
                  </motion.div>
                </CardHeader>
                
                <CardContent className="space-y-4 relative z-10">
                  <motion.ul 
                    className="space-y-3"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.2,
                        },
                      },
                    }}
                  >
                    {t.features.map((f, idx) => (
                      <motion.li 
                        key={f} 
                        className="flex items-center gap-2 text-sm"
                        variants={{
                          hidden: { opacity: 0, x: -10 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ 
                            duration: 1.5,
                            repeat: Infinity,
                            delay: idx * 0.1
                          }}
                        >
                          <Check className="h-4 w-4 text-primary shrink-0" />
                        </motion.div>
                        {f}
                      </motion.li>
                    ))}
                  </motion.ul>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      className={`w-full mt-4 ${t.highlight ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90 font-semibold' : ''}`}
                      variant={t.highlight ? 'default' : 'outline'}
                      onClick={() => navigate('/auth')}
                    >
                      {t.cta}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;

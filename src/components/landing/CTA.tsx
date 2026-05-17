import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div 
          className="relative rounded-3xl bg-gradient-to-r from-primary to-secondary p-12 overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"
            animate={{ 
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"
            animate={{ 
              x: [0, -20, 0],
              y: [0, 20, 0]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: 360,
                y: [0, -10, 0]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                y: { duration: 2, repeat: Infinity }
              }}
              className="h-12 w-12 mx-auto mb-6 flex items-center justify-center"
            >
              <Zap className="h-12 w-12 text-primary-foreground" />
            </motion.div>
            
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Ready to eliminate charging queues?
            </motion.h2>
            
            <motion.p 
              className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join thousands of EV owners and operators already using VoltSlot for smarter charging.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 bg-white text-primary hover:bg-white/90 shadow-lg"
                onClick={() => navigate('/auth')}
              >
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;

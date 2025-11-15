
import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-primary/5 to-white dark:from-primary/10 dark:to-black border-t border-primary/20 dark:border-primary/30 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo and Mission */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-2xl font-bold text-primary">PolyForm</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md leading-relaxed text-base">
                India's leading manufacturing aggregator platform. Connecting customers with 
                certified vendors through intelligent matching and transparent bidding.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://www.linkedin.com/company/polyform" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary/70 dark:text-primary/60 hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="Visit our LinkedIn page"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com/polyform" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary/70 dark:text-primary/60 hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="Visit our Twitter page"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.instagram.com/polyform" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary/70 dark:text-primary/60 hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="Visit our Instagram page"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:info@polyform.com"
                  className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary/70 dark:text-primary/60 hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="Send us an email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Platform */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-bold text-foreground mb-5 text-lg">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/quote" className="text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group"><span className="group-hover:translate-x-1 transition-transform">→</span> Upload RFQ</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group"><span className="group-hover:translate-x-1 transition-transform">→</span> Customer Dashboard</Link></li>
              <li><Link to="/partners" className="text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group"><span className="group-hover:translate-x-1 transition-transform">→</span> Vendor Portal</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group"><span className="group-hover:translate-x-1 transition-transform">→</span> Pricing</Link></li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-bold text-foreground mb-5 text-lg">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/services" className="text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group"><span className="group-hover:translate-x-1 transition-transform">→</span> Services & Materials</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group"><span className="group-hover:translate-x-1 transition-transform">→</span> About PolyBids</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group"><span className="group-hover:translate-x-1 transition-transform">→</span> Contact Support</Link></li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-primary/20 dark:border-primary/30 mt-12 pt-8 text-center"
        >
          <p className="text-muted-foreground">
            &copy; 2024 PolyForm. All rights reserved. Digitizing manufacturing through intelligent aggregation.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

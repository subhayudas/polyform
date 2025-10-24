
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-semibold">PolyForm</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              India's leading manufacturing aggregator platform. Connecting customers with 
              certified vendors through intelligent matching and transparent bidding.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Instagram
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/quote" className="hover:text-primary transition-colors">Upload RFQ</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Customer Dashboard</Link></li>
              <li><Link to="/partners" className="hover:text-primary transition-colors">Vendor Portal</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/services" className="hover:text-primary transition-colors">Service Dictionary</Link></li>
              <li><Link to="/materials" className="hover:text-primary transition-colors">Material Guide</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About PolyBids</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 PolyForm. All rights reserved. Digitizing manufacturing through intelligent aggregation.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

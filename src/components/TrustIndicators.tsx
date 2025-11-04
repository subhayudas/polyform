
import React from 'react';
import { Shield, Clock, Users, Award } from 'lucide-react';

const TrustIndicators = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/10">
      <div className="text-center group cursor-pointer">
        <div className="text-2xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-200">100+</div>
        <div className="text-sm text-white/70 flex items-center justify-center">
          <Shield className="w-4 h-4 mr-1" />
          Verified Vendors
        </div>
      </div>
      <div className="text-center group cursor-pointer">
        <div className="text-2xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-200">48hr</div>
        <div className="text-sm text-white/70 flex items-center justify-center">
          <Clock className="w-4 h-4 mr-1" />
          Bid Window
        </div>
      </div>
      <div className="text-center group cursor-pointer">
        <div className="text-2xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-200">1000+</div>
        <div className="text-sm text-white/70 flex items-center justify-center">
          <Users className="w-4 h-4 mr-1" />
          Projects Completed
        </div>
      </div>
      <div className="text-center group cursor-pointer">
        <div className="text-2xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-200">ISO</div>
        <div className="text-sm text-white/70 flex items-center justify-center">
          <Award className="w-4 h-4 mr-1" />
          Certified Partners
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;

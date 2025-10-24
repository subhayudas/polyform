
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PricingCallToAction = () => {
  return (
    <div className="mt-12 text-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 max-w-2xl mx-auto border border-polyform-green-200">
        <h2 className="text-2xl font-bold text-polyform-green-800 mb-3">
          Ready to Get Started?
        </h2>
        <p className="text-sm text-polyform-green-700 mb-6 leading-relaxed">
          Submit your 3D model and project details to receive a detailed quote from our experienced engineers.
        </p>
        <Link to="/upload">
          <Button size="lg" className="bg-polyform-green-600 hover:bg-polyform-green-700 text-white">
            Get Your Quote Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PricingCallToAction;

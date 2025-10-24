
import React from 'react';
import { Network, Shield, Clock, TrendingUp } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Network,
      number: "100+",
      label: "Verified Vendors",
      description: "ISO-certified manufacturing partners"
    },
    {
      icon: Shield,
      number: "99.8%",
      label: "Quality Rate",
      description: "Consistent precision and reliability"
    },
    {
      icon: Clock,
      number: "48hr",
      label: "Bid Window",
      description: "Fast, competitive pricing"
    },
    {
      icon: TrendingUp,
      number: "1000+",
      label: "Projects Delivered",
      description: "Successful manufacturing outcomes"
    }
  ];

  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Trusted Manufacturing Network
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            PolyForm aggregates India's finest manufacturers with transparent performance metrics
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-200">
                <stat.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-4xl font-bold text-primary-foreground mb-2 group-hover:scale-110 transition-transform duration-200">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-primary-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-primary-foreground/70">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

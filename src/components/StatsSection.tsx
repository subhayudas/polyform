
import React from 'react';
import { Network, Shield, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const StatsSection = () => {
  const stats = [
    {
      icon: Network,
      number: "100+",
      label: "Verified Vendors",
      description: "ISO-certified manufacturing partners",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: Shield,
      number: "99.8%",
      label: "Quality Rate",
      description: "Consistent precision and reliability",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Clock,
      number: "48hr",
      label: "Bid Window",
      description: "Fast, competitive pricing",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: TrendingUp,
      number: "1000+",
      label: "Projects Delivered",
      description: "Successful manufacturing outcomes",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 via-black to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.15) 0%, transparent 50%)',
        }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">Trusted Network</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Trusted Manufacturing Network
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            PolyForm aggregates India's finest manufacturers with transparent performance metrics
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-md border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Number */}
                  <motion.div
                    className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent mb-3"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
                  >
                    {stat.number}
                  </motion.div>
                  
                  {/* Label */}
                  <div className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {stat.label}
                  </div>
                  
                  {/* Description */}
                  <div className="text-sm text-white/60 leading-relaxed">
                    {stat.description}
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 to-orange-500/0 group-hover:from-cyan-500/5 group-hover:to-orange-500/5 transition-all duration-300 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

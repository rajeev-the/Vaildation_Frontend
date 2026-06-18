/**
 * StatsCards - Animated stat cards for displaying validation statistics
 */

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Check, AlertCircle, Database, Layers } from 'lucide-react';

const StatCard = ({
  icon: Icon,
  label,
  value,
  color = 'indigo',
  subtext = null,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrameId;
    let currentValue = 0;

    const animate = () => {
      const increment = (value - currentValue) / 20;
      currentValue += increment;

      if (Math.abs(value - currentValue) < 1) {
        setDisplayValue(Math.round(value));
      } else {
        setDisplayValue(Math.round(currentValue));
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  const colorConfig = {
    indigo: {
      bg: 'from-indigo-600/20 to-indigo-600/10',
      border: 'border-indigo-500/30',
      icon: 'text-indigo-400',
      accent: 'bg-indigo-500/20',
    },
    emerald: {
      bg: 'from-emerald-600/20 to-emerald-600/10',
      border: 'border-emerald-500/30',
      icon: 'text-emerald-400',
      accent: 'bg-emerald-500/20',
    },
    red: {
      bg: 'from-red-600/20 to-red-600/10',
      border: 'border-red-500/30',
      icon: 'text-red-400',
      accent: 'bg-red-500/20',
    },
    amber: {
      bg: 'from-amber-600/20 to-amber-600/10',
      border: 'border-amber-500/30',
      icon: 'text-amber-400',
      accent: 'bg-amber-500/20',
    },
  };

  const config = colorConfig[color] || colorConfig.indigo;

  return (
    <motion.div
      whileHover={{ y: -5, shadow: '0 20px 25px -5 rgba(99, 102, 241, 0.1)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`group relative overflow-hidden rounded-xl border ${config.border} bg-gradient-to-br ${config.bg} p-6 backdrop-blur-xl transition-all`}
    >
      {/* Background animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.05, scale: 1 }}
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-white to-transparent"
      />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-300">{label}</h4>
          <div className={`rounded-lg ${config.accent} p-2`}>
            <Icon className={`h-5 w-5 ${config.icon}`} />
          </div>
        </div>

        <div>
          <motion.div
            key={displayValue}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-gray-100"
          >
            {displayValue.toLocaleString()}
          </motion.div>

          {subtext && (
            <p className="mt-1 text-xs text-gray-400">{subtext}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const StatsCards = ({ validationData, isLoading }) => {
  if (isLoading || !validationData) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
            className="h-32 rounded-xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
    );
  }

  const totalProcessed =
    (validationData.valid_rows || 0) + (validationData.error_rows || 0);
  const percentageComplete =
    validationData.total_rows > 0
      ? Math.round((totalProcessed / validationData.total_rows) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Database}
        label="Total Rows"
        value={validationData.total_rows || 0}
        color="indigo"
      />
      <StatCard
        icon={Check}
        label="Valid Rows"
        value={validationData.valid_rows || 0}
        color="emerald"
        subtext="Successfully validated"
      />
      <StatCard
        icon={AlertCircle}
        label="Error Rows"
        value={validationData.error_rows || 0}
        color="red"
        subtext="Need attention"
      />
      <StatCard
        icon={Layers}
        label="Total Chunks"
        value={validationData.chunks?.length || 0}
        color="amber"
        subtext={`${percentageComplete}% complete`}
      />
    </div>
  );
};

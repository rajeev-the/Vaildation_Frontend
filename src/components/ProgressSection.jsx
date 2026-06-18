/**
 * ProgressSection - Circular progress ring and animated progress bar
 */

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const CircularProgress = ({ percentage, size = 200 }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="absolute inset-0 -rotate-90 transform"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="3"
          />

          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="3"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            strokeLinecap="round"
          />

          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <motion.p
              key={Math.round(percentage)}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-3xl font-bold text-gray-100"
            >
              {Math.round(percentage)}%
            </motion.p>
            <p className="text-xs text-gray-400">Complete</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const LinearProgressBar = ({ percentage, status }) => {
  const statusColors = {
    pending: 'from-gray-500 to-gray-600',
    processing: 'from-blue-500 to-blue-600',
    validating: 'from-amber-500 to-amber-600',
    validated: 'from-emerald-500 to-emerald-600',
    failed: 'from-red-500 to-red-600',
  };

  const colorClass = statusColors[status] || statusColors.processing;

  return (
    <div className="space-y-2">
      <div className="relative h-2 overflow-hidden rounded-full bg-white/10 backdrop-blur-xl">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${colorClass} shadow-lg shadow-indigo-500/50`}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Progress</span>
        <motion.span
          key={Math.round(percentage)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium text-gray-300"
        >
          {Math.round(percentage)}%
        </motion.span>
      </div>
    </div>
  );
};

export const ProgressSection = ({ validationData, isLoading, status = 'processing' }) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (!validationData) return;

    const total = validationData.total_rows || 0;
    if (total === 0) {
      setPercentage(0);
      return;
    }

    const processed =
      (validationData.valid_rows || 0) + (validationData.error_rows || 0);
    const calc = (processed / total) * 100;
    setPercentage(Math.min(calc, 100));
  }, [validationData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="space-y-8 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 backdrop-blur-xl"
    >
      <div className="text-center">
        <h3 className="mb-2 text-lg font-semibold text-gray-100">
          Validation Progress
        </h3>
        <p className="text-sm text-gray-400">
          {status === 'validated'
            ? 'Validation complete!'
            : 'Processing your file...'}
        </p>
      </div>

      {isLoading ? (
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center"
        >
          <div className="h-40 w-40 rounded-full border-4 border-white/10 border-t-indigo-500 animate-spin" />
        </motion.div>
      ) : (
        <div className="flex justify-center">
          <CircularProgress percentage={percentage} size={200} />
        </div>
      )}

      <LinearProgressBar percentage={percentage} status={status} />

      {validationData && (
        <div className="grid grid-cols-3 gap-4 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-xs text-gray-400">Valid</p>
            <p className="mt-1 text-lg font-semibold text-emerald-400">
              {validationData.valid_rows || 0}
            </p>
          </div>
          <div className="border-l border-r border-white/10">
            <div className="text-center">
              <p className="text-xs text-gray-400">Errors</p>
              <p className="mt-1 text-lg font-semibold text-red-400">
                {validationData.error_rows || 0}
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Total</p>
            <p className="mt-1 text-lg font-semibold text-indigo-400">
              {validationData.total_rows || 0}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

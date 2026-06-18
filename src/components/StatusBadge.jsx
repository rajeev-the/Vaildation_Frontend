/**
 * StatusBadge - Reusable status indicator component
 */

import { motion } from 'framer-motion';

const statusConfig = {
  pending: {
    bg: 'bg-gray-500/20',
    border: 'border-gray-500/30',
    dot: 'bg-gray-400',
    label: 'Pending',
  },
  processing: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
    label: 'Processing',
  },
  validating: {
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    label: 'Validating',
  },
  validated: {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    label: 'Validated',
  },
  failed: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
    label: 'Failed',
  },
  error: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
    label: 'Error',
  },
};

export const StatusBadge = ({ status = 'pending', size = 'md', showLabel = true }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const isActive =
    status === 'pending' || status === 'processing' || status === 'validating';

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 rounded-full border ${config.bg} ${config.border} ${sizeClasses[size]}`}
    >
      <motion.div
        animate={isActive ? { scale: [1, 1.3, 1] } : {}}
        transition={
          isActive
            ? { duration: 1, repeat: Infinity, ease: 'easeInOut' }
            : {}
        }
        className={`h-2 w-2 rounded-full ${config.dot}`}
      />
      {showLabel && (
        <span className="font-medium text-gray-200">{config.label}</span>
      )}
    </motion.div>
  );
};

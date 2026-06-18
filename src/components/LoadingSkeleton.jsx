/**
 * LoadingSkeleton - Beautiful skeleton loaders with shimmer effects
 */

import { motion } from 'framer-motion';

const shimmer = `
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export const SkeletonLoader = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <motion.div
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
    className={`${width} ${height} rounded-lg bg-white/5 ${className}`}
    style={{
      background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
      backgroundSize: '200% 100%',
    }}
  />
);

export const StatCardSkeleton = () => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
    <div className="space-y-4">
      <SkeletonLoader width="w-1/2" height="h-4" />
      <SkeletonLoader width="w-3/4" height="h-8" />
      <SkeletonLoader width="w-2/3" height="h-3" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr>
    <td className="px-6 py-4">
      <SkeletonLoader width="w-20" height="h-4" />
    </td>
    <td className="px-6 py-4">
      <SkeletonLoader width="w-40" height="h-4" />
    </td>
    <td className="px-6 py-4">
      <SkeletonLoader width="w-16" height="h-4" />
    </td>
    <td className="px-6 py-4">
      <SkeletonLoader width="w-24" height="h-8" />
    </td>
  </tr>
);

export const UploadZoneSkeleton = () => (
  <div className="rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-12 backdrop-blur-xl">
    <div className="space-y-4 text-center">
      <SkeletonLoader width="w-16 mx-auto" height="h-16" className="rounded-xl" />
      <SkeletonLoader width="w-48 mx-auto" height="h-4" />
      <SkeletonLoader width="w-40 mx-auto" height="h-3" />
    </div>
  </div>
);

export const FileInfoSkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {[1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <SkeletonLoader width="w-20" height="h-3" />
          <SkeletonLoader width="w-full" height="h-4" />
        </div>
      ))}
    </div>
  </div>
);

export const ProgressSectionSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-center">
      <SkeletonLoader width="w-40 h-40" height="h-40" className="rounded-full" />
    </div>
    <div className="space-y-2">
      <SkeletonLoader width="w-full" height="h-2" className="rounded-full" />
      <SkeletonLoader width="w-32" height="h-3" />
    </div>
  </div>
);

/**
 * SuccessBanner - Success state with confetti animation
 */

import { motion } from 'framer-motion';
import { CheckCircle2, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { downloadInvalidRows } from '../api/validationApi';

// Confetti particles
const Confetti = ({ delay = 0 }) => {
  const x = Math.random() * 100;
  const duration = 2 + Math.random() * 0.5;

  return (
    <motion.div
      initial={{ y: -10, x: `${x}%`, opacity: 1, rotate: 0 }}
      animate={{
        y: 600,
        opacity: 0,
        rotate: 360 + Math.random() * 360,
      }}
      transition={{
        duration,
        delay,
        ease: 'easeIn',
      }}
      className="pointer-events-none fixed h-2 w-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 rounded-full"
    />
  );
};

export const SuccessBanner = ({
  validationData,
 sessionId,
  onStartNew,
}) => {
  const [confetti, setConfetti] = useState([]);
   
  useEffect(() => {
    // Generate confetti particles
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      delay: (i * 0.02) % 0.5,
    }));
    setConfetti(particles);
  }, []);

  const hasErrors = (validationData?.error_rows || 0) > 0;
   
  console.log('validationData', validationData);

const handleDownloadInvalidRows = async () => {
  try {
     console.log('Downloading invalid rows for session:', sessionId);
    const data = await downloadInvalidRows(sessionId);
    
console.log('Download response:', data);
    window.open(data.download_url, "_blank");
  } catch (error) {
    console.error(error);
  }
};

  return (
    <>
      {/* Confetti particles */}
      {confetti.map((particle) => (
        <Confetti key={particle.id} delay={particle.delay} />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="space-y-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-600/20 via-emerald-600/10 to-transparent p-8 backdrop-blur-xl sm:p-12"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.2 }}
            className="mx-auto mb-4"
          >
            <CheckCircle2 className="h-16 w-16 text-emerald-400" />
          </motion.div>

          <h2 className="mb-2 text-3xl font-bold text-gray-100">
            Validation Complete!
          </h2>
          <p className="text-gray-400">
            Your CSV file has been successfully validated
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: 'Total Rows',
              value: validationData?.total_rows || 0,
              color: 'indigo',
            },
            {
              label: 'Valid Rows',
              value: validationData?.valid_rows || 0,
              color: 'emerald',
            },
            {
              label: 'Error Rows',
              value: validationData?.error_rows || 0,
              color: 'red',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`rounded-lg border px-4 py-4 text-center ${
                stat.color === 'indigo'
                  ? 'border-indigo-500/20 bg-indigo-500/5'
                  : stat.color === 'emerald'
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : 'border-red-500/20 bg-red-500/5'
              }`}
            >
              <p className="text-xs font-medium text-gray-400">{stat.label}</p>
              <motion.p
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`mt-2 text-2xl font-bold ${
                  stat.color === 'indigo'
                    ? 'text-indigo-400'
                    : stat.color === 'emerald'
                      ? 'text-emerald-400'
                      : 'text-red-400'
                }`}
              >
                {stat.value.toLocaleString()}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Success message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-center"
        >
          <p className="text-sm text-emerald-300">
            {hasErrors
              ? `Great! ${validationData?.valid_rows.toLocaleString()} rows passed validation. ${validationData?.error_rows.toLocaleString()} rows need attention.`
              : 'Perfect! All rows passed validation successfully.'}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {hasErrors && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={handleDownloadInvalidRows}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-3 font-medium text-red-300 hover:bg-red-500/20 transition-all"
            >
              <Download className="h-4 w-4" />
              Download Invalid Rows
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: hasErrors ? 0.8 : 0.7 }}
            onClick={onStartNew}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
          >
            Upload Another File
          </motion.button>
        </div>

        {/* Download chunks info */}
        {validationData?.chunks && validationData.chunks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="rounded-lg border border-white/10 bg-white/5 p-4"
          >
            <p className="mb-2 text-xs font-medium text-gray-300">
              📦 {validationData.chunks.length} validated chunk file
              {validationData.chunks.length !== 1 ? 's' : ''} available for download
            </p>
            <p className="text-xs text-gray-400">
              Scroll down to the Chunks section to download individual files.
            </p>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

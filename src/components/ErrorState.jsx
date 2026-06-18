/**
 * ErrorState - Elegant error screens for various failure scenarios
 */

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  errorDetails = null,
  showDetails = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent p-8 backdrop-blur-xl sm:p-12"
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-6 rounded-full bg-red-500/20 p-4"
        >
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </motion.div>

        <h3 className="mb-2 text-xl font-semibold text-gray-100">{title}</h3>
        <p className="mb-6 max-w-md text-gray-400">{message}</p>

        {showDetails && errorDetails && (
          <div className="mb-6 w-full max-w-md rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-left">
            <p className="text-sm font-mono text-red-300">{errorDetails}</p>
          </div>
        )}

        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-indigo-500/20"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export const UploadError = ({ onRetry }) => (
  <ErrorState
    title="Upload Failed"
    message="There was a problem uploading your file. Please check the file and try again."
    onRetry={onRetry}
  />
);

export const ValidationError = ({ onRetry, errorMessage = null }) => (
  <ErrorState
    title="Validation Error"
    message={
      errorMessage || 'The validation process encountered an error. Please try again.'
    }
    errorDetails={errorMessage}
    showDetails={!!errorMessage}
    onRetry={onRetry}
  />
);

export const PollingError = ({ onRetry, sessionId }) => (
  <ErrorState
    title="Connection Lost"
    message={`Failed to fetch validation status for session ${sessionId}. Retrying...`}
    onRetry={onRetry}
  />
);

export const NetworkError = ({ onRetry }) => (
  <ErrorState
    title="Network Error"
    message="Please check your internet connection and try again."
    onRetry={onRetry}
  />
);

/**
 * Dashboard - Main CSV Validation Dashboard component
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useValidationSession } from '../hooks/useValidationSession';
import { UploadZone } from './UploadZone';
import { StatsCards } from './StatsCards';
import { ProgressSection } from './ProgressSection';
import { ChunksTable } from './ChunksTable';
import { SuccessBanner } from './SuccessBanner';
import { ErrorState } from './ErrorState';
import { StatusBadge } from './StatusBadge';
import  {getChunks , }  from '../api/validationApi';
import {
  StatCardSkeleton,
  ProgressSectionSkeleton,
  FileInfoSkeleton,
} from './LoadingSkeleton';

export const Dashboard = () => {
  const {
    sessionId,
    uploadProgress,
    validationData,
    loading,
    error,
    isPolling,
    uploadCSVFile,
    downloadChunkFile,
    downloadInvalidRowsFile,
    clearSession,
    retryPolling,
  } = useValidationSession();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [getchunkss, setGetChunks] = useState();

  // Reset selected file after successful upload
  useEffect(() => {
    if (validationData?.session_id && selectedFile) {
      // Keep selected file visible after upload
    }
  }, [validationData, selectedFile]);

  const handleUpload = async (file) => {
    setSelectedFile(file);
    await uploadCSVFile(file);
  };

  const handleStartNew = () => {
    clearSession();
    setSelectedFile(null);
  };

  const isValidationComplete = validationData?.status === 'validated';
  const isValidationFailed = validationData?.status === 'failed';
  const showChunks =
    isValidationComplete &&
    validationData?.chunks &&
    validationData.chunks.length > 0;
  useEffect(() => {
  const fetchChunks = async () => {
    if (showChunks && validationData?.session_id) {
      const data = await getChunks(validationData.session_id);
      setGetChunks(data);
    }
  };

  fetchChunks();
}, [showChunks, validationData?.session_id]);



  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950'
        : 'bg-gradient-to-br from-white via-slate-50 to-slate-100'
    }`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.03, 0.08, 0.03],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -right-1/4 -top-1/4 h-96 w-96 rounded-full bg-indigo-600 blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.03, 0.08, 0.03],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-1/4 -left-1/4 h-96 w-96 rounded-full bg-purple-600 blur-3xl"
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 p-2">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-100">
                  CSV Validation
                </h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {validationData && (
                <StatusBadge status={validationData.status} size="md" />
              )}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="rounded-lg p-2 hover:bg-white/10 transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {/* Error State */}
          {error && !isValidationFailed && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <ErrorState
                title="Validation Error"
                message={error}
                errorDetails={error}
                showDetails={true}
                onRetry={() => {
                  if (isPolling) {
                    retryPolling();
                  } else {
                    handleStartNew();
                  }
                }}
              />
            </motion.div>
          )}

          {/* Success State */}
          {isValidationComplete && validationData && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <SuccessBanner
                validationData={validationData}
                sessionId={sessionId}
                onStartNew={handleStartNew}
              />
            </motion.div>
          )}

          {/* Main Content Area */}
          {!isValidationFailed && (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Upload Section */}
              {!sessionId ? (
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-100">
                    Upload CSV
                  </h2>
                  <UploadZone
                    onUpload={handleUpload}
                    isLoading={loading}
                    progress={uploadProgress}
                    selectedFile={selectedFile}
                  />
                </div>
              ) : (
                <>
                  {/* File Information */}
                  {validationData && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-xl"
                    >
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Filename
                          </p>
                          <p className="mt-2 text-sm font-semibold text-gray-100">
                            {validationData.original_filename}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Session ID
                          </p>
                          <p className="mt-2 text-sm font-mono text-gray-300">
                            {validationData.session_id.slice(0, 8)}...
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Status
                          </p>
                          <div className="mt-2">
                            <StatusBadge
                              status={validationData.status}
                              size="sm"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Total Rows
                          </p>
                          <p className="mt-2 text-sm font-semibold text-gray-100">
                            {validationData.total_rows?.toLocaleString() || '-'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                 <h3 className="text-gray-200"> Statistics Section</h3>
                  {loading && !validationData ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {[1, 2, 3, 4].map((i) => (
                        <StatCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : (
                    <StatsCards
                      validationData={validationData}
                      isLoading={loading}
                    />
                  )}

            

                  {/* Chunks Table - Only show when validation is complete */}
                  {showChunks && (
                    <div>
                      <h3 className="mb-4 text-xl font-bold text-gray-100">
                        Validated Chunks
                      </h3>
                      <ChunksTable
                        chunks={getchunkss}
                        sessionId={sessionId}
                        isLoading={loading}
                        onDownload={downloadChunkFile}
                      />
                    </div>
                  )}

                  {/* Start New Upload Button */}
                  {isValidationComplete && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex justify-center"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStartNew}
                        className="rounded-lg border border-white/20 bg-white/5 px-8 py-3 font-medium text-gray-200 hover:bg-white/10 transition-all"
                      >
                        Clear & Upload Another File
                      </motion.button>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 bg-white/5 py-6 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
          <p>CSV Validation Dashboard • Enterprise Grade • Real-time Processing</p>
        </div>
      </footer>
    </div>
  );
};

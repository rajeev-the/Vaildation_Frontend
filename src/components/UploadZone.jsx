/**
 * UploadZone - Beautiful drag-and-drop CSV upload component
 */

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X } from 'lucide-react';
import { formatFileSize } from '../api/validationApi';

export const UploadZone = ({ onUpload, isLoading, progress, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [localFile, setLocalFile] = useState(selectedFile);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.includes('csv') || file.name.endsWith('.csv')) {
        setLocalFile(file);
        onUpload(file);
      }
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      setLocalFile(file);
      onUpload(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setLocalFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayFile = localFile || selectedFile;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="cursor-pointer"
    >
      <motion.div
        animate={{
          borderColor: isDragging
            ? 'rgba(99, 102, 241, 0.5)'
            : 'rgba(255, 255, 255, 0.1)',
          backgroundColor: isDragging
            ? 'rgba(99, 102, 241, 0.05)'
            : 'rgba(255, 255, 255, 0.02)',
        }}
        transition={{ duration: 0.2 }}
        className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-12 backdrop-blur-xl transition-all"
      >
        {/* Animated background gradient on drag */}
        <motion.div
          animate={
            isDragging
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.8 }
          }
          className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"
        />

        <div className="relative z-10 space-y-6 text-center">
          {/* Icon */}
          <motion.div
            animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mx-auto h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-3 text-indigo-400"
          >
            <Upload className="h-full w-full" />
          </motion.div>

          {/* Text Content */}
          {displayFile && !isLoading ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                <File className="h-5 w-5 text-emerald-400" />
                <div className="text-left">
                  <p className="font-medium text-gray-100">{displayFile.name}</p>
                  <p className="text-sm text-gray-400">
                    {formatFileSize(displayFile.size)}
                  </p>
                </div>
                <button
                  onClick={handleClear}
                  className="ml-auto rounded-lg p-1 hover:bg-red-500/20"
                >
                  <X className="h-5 w-5 text-red-400" />
                </button>
              </div>
              <button
                onClick={handleBrowseClick}
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Change File
              </button>
            </motion.div>
          ) : (
            <>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-100">
                  {isDragging
                    ? 'Drop your CSV file here'
                    : 'Drag & drop your CSV file'}
                </h3>
                <p className="text-gray-400">
                  {isLoading
                    ? 'Uploading...'
                    : 'or click below to browse from your computer'}
                </p>
              </div>

              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <div className="mx-auto h-2 w-48 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                    />
                  </div>
                  <p className="text-sm font-medium text-indigo-400">
                    {Math.round(progress)}%
                  </p>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBrowseClick}
                  className="inline-block rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-indigo-500/20"
                >
                  Browse Files
                </motion.button>
              )}
            </>
          )}

          {/* File type info */}
          <p className="text-xs text-gray-500">
            CSV files only 
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
      </motion.div>
    </div>
  );
};

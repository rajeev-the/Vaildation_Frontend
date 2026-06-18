/**
 * ChunksTable - Modern responsive table for displaying chunks
 */

import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import {downloadChunk} from './../api/validationApi';

export const ChunksTable = ({
  chunks = [],
  sessionId,
  isLoading,
  onDownload,
}) => {
  const [downloadingChunkId, setDownloadingChunkId] = useState(null);

const handleDownloadClick = async (chunk) => {
  try {
    const response = await downloadChunk(
      sessionId,
      chunk.chunk_id
    );

    const data = await response.json();

    window.open(data.download_url, "_blank");
  } catch (error) {
    console.error("Download failed:", error);
  }
};

  if (isLoading || chunks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 backdrop-blur-xl text-center"
      >
        <p className="text-gray-400">No chunks available yet</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="overflow-hidden rounded-xl border border-white/10 backdrop-blur-xl"
    >
      <div className="bg-gradient-to-r from-white/5 to-white/[0.02]">
        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Chunk #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Filename
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Rows
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {chunks.map((chunk, index) => (
                <motion.tr
                  key={chunk.chunk_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                >
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-500/20 text-sm font-semibold text-indigo-400">
                      {chunk.chunk_index}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-100">{chunk.filename}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-sm font-medium text-gray-300">
                      {chunk.row_count.toLocaleString()} rows
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownloadClick(chunk)}
                      disabled={downloadingChunkId === chunk.chunk_id}
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingChunkId === chunk.chunk_id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Download
                        </>
                      )}
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3 p-4">
          {chunks.map((chunk, index) => (
            <motion.div
              key={chunk.chunk_id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-lg bg-indigo-500/20 text-xs font-semibold text-indigo-400">
                        {chunk.chunk_index}
                      </span>
                      <p className="font-medium text-gray-100">{chunk.filename}</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {chunk.row_count.toLocaleString()} rows
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDownloadClick(chunk)}
                  disabled={downloadingChunkId === chunk.chunk_id}
                  className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {downloadingChunkId === chunk.chunk_id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

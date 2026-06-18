/**
 * CSV Validation API Client
 * Handles all communication with the validation backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ;

/**
 * Upload a CSV file to the validation service
 * @param {File} file - The CSV file to upload
 * @returns {Promise<Object>} Response containing session_id and upload status
 */
export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
};

/**
 * Get the current validation status for a session
 * @param {string} sessionId - The session ID
 * @returns {Promise<Object>} Status data including validation progress
 */
export const getValidationStatus = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/upload/${sessionId}/status`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch status');
  }

  return response.json();
};

/**
 * Get the list of chunks for a session
 * @param {string} sessionId - The session ID
 * @returns {Promise<Array>} Array of chunk objects
 */
export const getChunks = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/upload/${sessionId}/chunks`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch chunks');
  }

  const data = await response.json();
  return data.chunks || [];
};

/**
 * Download a specific chunk file
 * @param {string} sessionId - The session ID
 * @param {string} chunkId - The chunk ID
 * @returns {Promise<Blob>} The chunk file as a blob
 */
export const downloadChunk = async (sessionId, chunkId) => {
  const response = await fetch(
    `${API_BASE_URL}/upload/${sessionId}/chunks/${chunkId}/download`
  );

  if (!response.ok) {
    throw new Error('Failed to download chunk');
  }

  return response;
};

/**
 * Download invalid rows for a session
 * @param {string} sessionId - The session ID
 * @returns {Promise<Blob>} The invalid rows file as a blob
 */
export const downloadInvalidRows = async (sessionId) => {
  console.log('Downloading invalid rows for session:', sessionId);
  const response = await fetch(
    `${API_BASE_URL}/upload/${sessionId}/download/invalid`
  );

  if (!response.ok) {
    throw new Error("Failed to download invalid rows");
  }

  return response.json();
};

/**
 * Trigger a file download from a blob
 * @param {Blob} blob - The file blob
 * @param {string} filename - The desired filename
 */
export const triggerDownload = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Format file size in human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

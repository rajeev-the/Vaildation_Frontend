/**
 * Custom hook for managing CSV validation sessions
 * Handles upload, polling, persistence, and error management
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import * as validationApi from '../api/validationApi';

const STORAGE_KEY = 'validation_session_id';
const POLLING_INTERVAL = 2000; // 2 seconds

/**
 * useValidationSession - Main hook for managing validation workflow
 * @returns {Object} Session state and methods
 */
export const useValidationSession = () => {
  const [sessionId, setSessionId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationData, setValidationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const pollingIntervalRef = useRef(null);
  const uploadAbortRef = useRef(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem(STORAGE_KEY);
    if (savedSessionId) {
      setSessionId(savedSessionId);
      setIsPolling(true);
    }
  }, []);

  // Start polling when session is available
  useEffect(() => {
    if (!sessionId || !isPolling) return;

    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Initial status fetch
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const data = await validationApi.getValidationStatus(sessionId);
        setValidationData(data);
        setError(null);

        // Stop polling if validation is complete
        const completedStatuses = ['validated', 'failed', 'error'];
        if (completedStatuses.includes(data.status)) {
          setIsPolling(false);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch validation status');
        // Don't stop polling on error, retry next cycle
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchStatus();

    // Set up polling interval
    pollingIntervalRef.current = setInterval(() => {
      fetchStatus();
    }, POLLING_INTERVAL);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [sessionId, isPolling]);

  /**
   * Upload a CSV file
   * @param {File} file - The CSV file to upload
   */
  const uploadCSVFile = useCallback(async (file) => {
    try {
      setError(null);
      setLoading(true);
      setUploadProgress(0);

      // Validate file type
      if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
        throw new Error('Please upload a CSV file');
      }

      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File size exceeds 50MB limit');
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 30;
        });
      }, 200);

      const response = await validationApi.uploadCSV(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Store session ID and start polling
      localStorage.setItem(STORAGE_KEY, response.session_id);
      setSessionId(response.session_id);
      setValidationData({
        session_id: response.session_id,
        original_filename: response.original_filename,
        status: response.status,
        total_rows: 0,
        valid_rows: 0,
        error_rows: 0,
        chunks: [],
      });
      setIsPolling(true);
      setError(null);
    } catch (err) {
      setError(err.message || 'Upload failed');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Download a specific chunk
   * @param {string} chunkId - The chunk ID to download
   * @param {string} filename - The filename for the download
   */
  const downloadChunkFile = useCallback(
    async (chunkId, filename) => {
      try {
        if (!sessionId) {
          throw new Error('No active session');
        }

        const blob = await validationApi.downloadChunk(sessionId, chunkId);
        validationApi.triggerDownload(blob, filename);
      } catch (err) {
        setError(err.message || 'Failed to download chunk');
      }
    },
    [sessionId]
  );

  /**
   * Download invalid rows
   */
  const downloadInvalidRowsFile = useCallback(async () => {
    try {
      if (!sessionId) {
        throw new Error('No active session');
      }

      const blob = await validationApi.downloadInvalidRows(sessionId);
      const filename = `invalid-rows-${sessionId}.csv`;
      validationApi.triggerDownload(blob, filename);
    } catch (err) {
      setError(err.message || 'Failed to download invalid rows');
    }
  }, [sessionId]);

  /**
   * Clear the current session
   */
  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSessionId(null);
    setValidationData(null);
    setUploadProgress(0);
    setError(null);
    setIsPolling(false);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
  }, []);

  /**
   * Retry polling after an error
   */
  const retryPolling = useCallback(() => {
    setError(null);
    setIsPolling(true);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (uploadAbortRef.current) {
        uploadAbortRef.current.abort();
      }
    };
  }, []);

  return {
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
  };
};

# Implementation Examples

## Complete Usage Example

Here's how the dashboard works end-to-end:

### 1. User Flow

```
Upload CSV
    ↓
[UploadZone - Validate & Show Progress]
    ↓
Session ID → localStorage
    ↓
[useValidationSession] Start Polling (2 sec intervals)
    ↓
[Dashboard] Show stats & progress
    ↓
Status Updates: pending → processing → validating → validated
    ↓
Show Success Banner with Results
    ↓
Download Options: Invalid Rows & Chunks
```

### 2. Component Integration

```jsx
// App.jsx
import { Dashboard } from './components/Dashboard'

function App() {
  return <Dashboard />
}

// That's it! All state management is handled by useValidationSession hook
```

### 3. Session Management

```jsx
// Inside Dashboard, managed by useValidationSession
const {
  sessionId,           // Current session ID
  uploadProgress,      // 0-100
  validationData,      // Status, rows, chunks
  loading,             // Is fetching
  error,               // Error message
  isPolling,           // Currently polling
  uploadCSVFile,       // Upload function
  downloadChunkFile,   // Download chunk
  downloadInvalidRowsFile, // Download invalid rows
  clearSession,        // Clear & reset
  retryPolling,        // Retry on error
} = useValidationSession()

// Upload a file
const handleUpload = (file) => {
  uploadCSVFile(file)
}

// Download chunk
const handleDownloadChunk = (chunkId, filename) => {
  downloadChunkFile(chunkId, filename)
}

// Download invalid rows
const handleDownloadInvalid = () => {
  downloadInvalidRowsFile()
}
```

### 4. API Flow

```javascript
// Step 1: Upload
POST /api/v1/upload
├─ file: <CSV>
└─ Response:
   ├─ session_id: "abc123"
   ├─ status: "pending"
   └─ original_filename: "orders.csv"

// Step 2: Start Polling (every 2 seconds)
GET /api/v1/upload/abc123/status
└─ Response updates with:
   ├─ status: "processing" → "validating" → "validated"
   ├─ total_rows: 1000
   ├─ valid_rows: 950
   ├─ error_rows: 50
   └─ chunks: [...]

// Step 3: When validated === true, stop polling
// Step 4: Allow downloads
GET /api/v1/upload/abc123/chunks/{chunk_id}/download
GET /api/v1/upload/abc123/download/invalid
```

### 5. localStorage Usage

```javascript
// Dashboard stores session ID automatically
localStorage.setItem('validation_session_id', sessionId)

// On page refresh, hook restores it
useEffect(() => {
  const savedSessionId = localStorage.getItem('validation_session_id')
  if (savedSessionId) {
    setSessionId(savedSessionId)
    setIsPolling(true)
  }
}, [])

// Clear when user clicks "Clear & Upload Another File"
const handleStartNew = () => {
  localStorage.removeItem('validation_session_id')
  clearSession()
}
```

### 6. Error Handling

```javascript
// Upload validation
if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
  throw new Error('Please upload a CSV file')
}

if (file.size > 50 * 1024 * 1024) {
  throw new Error('File size exceeds 50MB limit')
}

// API error catching
try {
  const data = await validationApi.getValidationStatus(sessionId)
  setValidationData(data)
  setError(null)
} catch (err) {
  setError(err.message)
  // Retry on next polling interval
}

// User sees ErrorState component with retry button
<ErrorState
  title="Validation Error"
  message={error}
  onRetry={() => retryPolling()}
/>
```

### 7. Progress Tracking

```javascript
// While uploading
<UploadZone
  onUpload={handleUpload}
  isLoading={loading}
  progress={uploadProgress}  // 0-100
  selectedFile={selectedFile}
/>

// While validating
<ProgressSection
  validationData={validationData}
  isLoading={loading}
  status={validationData?.status}
/>
// Calculates: (valid_rows + error_rows) / total_rows * 100
```

### 8. Stats Display

```javascript
// Animated counter that goes from 0 to final value
<StatsCards
  validationData={validationData}
  isLoading={loading}
/>
// Shows:
// - Total Rows: 1000
// - Valid Rows: 950
// - Error Rows: 50
// - Total Chunks: 2
```

### 9. Success State

```javascript
// When validation completes (status === "validated")
<SuccessBanner
  validationData={validationData}
  onDownloadInvalidRows={downloadInvalidRowsFile}
  onStartNew={handleStartNew}
/>
// Features:
// - Confetti animation
// - Statistics display
// - Download buttons
// - "Upload Another File" option
```

### 10. Responsive Design

```jsx
// Mobile-first with Tailwind
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {/* Single column on mobile, 2 on tablet, 4 on desktop */}
</div>

<table className="hidden sm:block">
  {/* Hide table on mobile, show on desktop */}
</table>

<div className="sm:hidden space-y-3">
  {/* Mobile card view instead of table */}
</div>
```

### 11. Environment Configuration

```bash
# .env
VITE_API_URL=http://localhost:3000/api/v1

# .env.production
VITE_API_URL=https://api.yourdomain.com/api/v1
```

```javascript
// API client automatically uses it
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
```

### 12. Customization Examples

**Change polling interval:**
```javascript
// useValidationSession.js
const POLLING_INTERVAL = 5000 // 5 seconds instead of 2
```

**Change upload file size limit:**
```javascript
// useValidationSession.js
const maxSize = 100 * 1024 * 1024 // 100MB instead of 50MB
```

**Change colors:**
```javascript
// StatusBadge.jsx
const statusConfig = {
  validated: {
    bg: 'bg-green-500/20',    // Change from emerald
    border: 'border-green-500/30',
    dot: 'bg-green-400',
    label: 'Validated',
  },
}
```

**Change animation speed:**
```javascript
// ProgressSection.jsx
<motion.circle
  transition={{ duration: 2, ease: 'easeInOut' }} // From 1 to 2 seconds
/>
```

### 13. Performance Optimization

```javascript
// Memoize heavy components
export const StatsCards = memo(({ validationData, isLoading }) => {
  // ...
})

// Prevent unnecessary re-renders
const uploadCSVFile = useCallback(async (file) => {
  // ...
}, [])

// Cleanup intervals on unmount
useEffect(() => {
  return () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }
  }
}, [])
```

### 14. Testing Scenarios

**Test 1: Complete Happy Path**
```
1. Upload valid CSV
2. Watch progress update
3. See success banner
4. Download invalid rows
5. Download chunks
6. Clear and upload new file
```

**Test 2: Session Persistence**
```
1. Upload file
2. Refresh page
3. Session restores automatically
4. Polling continues
5. Can download results
```

**Test 3: Error Scenarios**
```
1. Try uploading non-CSV file → Error shown
2. Upload oversized file → Error shown
3. Network error during polling → Retry option shown
4. API error on download → Error handled gracefully
```

**Test 4: Mobile Responsiveness**
```
1. Open on mobile device
2. Drag-drop area responsive
3. Stats cards stack vertically
4. Table converts to card view
5. All buttons easily tappable
```

### 15. Monitoring & Logging

```javascript
// Add error tracking (optional)
try {
  await validationApi.uploadCSV(file)
} catch (err) {
  // Log to Sentry, LogRocket, etc.
  Sentry.captureException(err)
  setError(err.message)
}

// Track user actions (optional)
analytics.track('csv_upload_started', {
  filename: file.name,
  size: file.size,
})

analytics.track('validation_completed', {
  totalRows: validationData.total_rows,
  validRows: validationData.valid_rows,
  errorRows: validationData.error_rows,
})
```

### 16. Backend Integration Checklist

- [ ] Implement POST /upload endpoint
- [ ] Implement GET /upload/{id}/status endpoint
- [ ] Implement GET /upload/{id}/chunks endpoint
- [ ] Implement GET /upload/{id}/chunks/{chunkId}/download
- [ ] Implement GET /upload/{id}/download/invalid
- [ ] Configure CORS headers
- [ ] Set appropriate status codes
- [ ] Handle file validation
- [ ] Process validation in background
- [ ] Store chunks for download
- [ ] Clean up old sessions

## Summary

The dashboard is **fully production-ready** and includes:

✅ Complete component library
✅ Session management with persistence
✅ Real-time polling with error recovery
✅ Beautiful animations and transitions
✅ Mobile-responsive design
✅ Error handling and recovery
✅ Download capabilities
✅ Progress tracking
✅ Skeleton loaders
✅ Success/failure states

Just connect your backend API and you're ready to launch!

# CSV Validation Dashboard

A beautiful, production-ready SaaS-style CSV validation dashboard built with React, Vite, Tailwind CSS, and Framer Motion.

## Features

✨ **Beautiful UI**
- Glassmorphism design with dark mode
- Smooth Framer Motion animations
- Responsive mobile-first design
- Professional SaaS-style aesthetics

📊 **Core Functionality**
- Drag-and-drop CSV file upload
- Real-time validation progress tracking
- Animated progress indicators
- Live statistics with counter animations
- Session persistence with localStorage
- Automatic session restoration on page refresh

🔄 **Advanced Features**
- Automatic 2-second polling while validating
- Error handling with retry mechanisms
- Beautiful skeleton loaders
- Confetti success animations
- Download functionality for chunks and invalid rows
- Mobile-responsive tables

## Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- React 18+
- Vite
- Tailwind CSS

### Installation

The dashboard is already configured in your Vite + React + Tailwind CSS project. Just ensure all dependencies are installed:

```bash
npm install
```

### Required Dependencies

Make sure you have these packages installed:
```bash
npm install framer-motion lucide-react
```

## Environment Configuration

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api/v1
```

Or for production:
```env
VITE_API_URL=https://api.yourdomain.com/api/v1
```

## Project Structure

```
frontend/src/
├── api/
│   └── validationApi.js          # API client for backend communication
├── hooks/
│   └── useValidationSession.js    # Custom hook for session management
├── components/
│   ├── Dashboard.jsx              # Main dashboard component
│   ├── UploadZone.jsx             # Drag-and-drop upload area
│   ├── StatusBadge.jsx            # Status indicator component
│   ├── StatsCards.jsx             # Animated statistics cards
│   ├── ProgressSection.jsx        # Circular and linear progress
│   ├── ChunksTable.jsx            # Responsive chunks table
│   ├── SuccessBanner.jsx          # Success state with confetti
│   ├── ErrorState.jsx             # Error handling components
│   └── LoadingSkeleton.jsx        # Skeleton loaders with shimmer
├── App.jsx                        # App entry point
└── main.jsx
```

## API Integration

The dashboard expects these API endpoints:

### Upload CSV
```
POST /api/v1/upload
Content-Type: multipart/form-data

file: <CSV file>

Response:
{
  "session_id": "8d5f2b3d-7f3f-4b0c-9c1c-123456789abc",
  "original_filename": "orders.csv",
  "file_size_bytes": 10240,
  "status": "pending",
  "message": "Upload received. Validation started.",
  "poll_status_url": "/api/v1/upload/{session_id}/status"
}
```

### Get Validation Status
```
GET /api/v1/upload/{session_id}/status

Response:
{
  "session_id": "8d5f2b3d-7f3f-4b0c-9c1c-123456789abc",
  "original_filename": "orders.csv",
  "status": "processing",
  "total_rows": 1000,
  "valid_rows": 950,
  "error_rows": 50,
  "chunks": [
    {
      "chunk_id": "chunk-id-1",
      "chunk_index": 1,
      "row_count": 500,
      "filename": "chunk_1.csv"
    }
  ]
}
```

### Get Chunks List
```
GET /api/v1/upload/{session_id}/chunks
```

### Download Chunk
```
GET /api/v1/upload/{session_id}/chunks/{chunk_id}/download
```

### Download Invalid Rows
```
GET /api/v1/upload/{session_id}/download/invalid
```

## Status Values

The dashboard tracks these validation statuses:

- **pending** - Upload received, validation starting
- **processing** - Actively validating the file
- **validating** - In validation stage
- **validated** - Validation complete, success
- **failed** - Validation failed
- **error** - System error occurred

## Session Management

The dashboard automatically:

1. **Stores session ID** in localStorage under key `validation_session_id`
2. **Restores session** on page refresh
3. **Continues polling** from where it left off
4. **Persists state** across browser sessions

### Clearing Sessions

Users can manually clear sessions by:
- Clicking "Clear & Upload Another File" button
- This removes localStorage entry and resets all state

## Polling Behavior

The dashboard polls every 2 seconds while status is:
- `pending`
- `processing`
- `validating`

Polling stops when status is:
- `validated`
- `failed`
- `error`

## Styling

### Color Palette

- **Primary**: `#6366F1` (Indigo)
- **Secondary**: `#8B5CF6` (Purple)
- **Success**: `#10B981` (Emerald)
- **Warning**: `#F59E0B` (Amber)
- **Danger**: `#EF4444` (Red)
- **Background**: `#0F172A` (Slate)

### Design System

- Glassmorphism with `backdrop-blur-xl`
- Soft shadows with `shadow-lg shadow-indigo-500/20`
- Gradient backgrounds
- Smooth transitions and animations
- Mobile-first responsive design

## Performance Optimizations

✅ **Implemented**
- Animated counter values using `requestAnimationFrame`
- Efficient re-render prevention with React hooks
- Lazy component loading with AnimatePresence
- Optimized Framer Motion animations
- Minimal DOM manipulation
- Debounced file uploads

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Customization

### Changing Colors

Edit the color values in each component's `colorConfig` or `statusConfig`:

```javascript
const statusConfig = {
  pending: {
    bg: 'bg-gray-500/20',
    border: 'border-gray-500/30',
    dot: 'bg-gray-400',
    label: 'Pending',
  },
  // ... more statuses
};
```

### Adjusting Polling Interval

In `useValidationSession.js`:

```javascript
const POLLING_INTERVAL = 2000; // Change this value (milliseconds)
```

### Modifying Upload Limits

In `useValidationSession.js`:

```javascript
const maxSize = 50 * 1024 * 1024; // Change to your desired limit
```

## Error Handling

The dashboard gracefully handles:
- Network errors with retry functionality
- Upload failures with user-friendly messages
- Invalid file types with validation
- File size limits with clear messaging
- Polling failures with automatic retry
- Session restoration failures

## Production Checklist

- [ ] Set `VITE_API_URL` to production API endpoint
- [ ] Ensure CORS is properly configured
- [ ] Test with various CSV file sizes
- [ ] Verify error handling in different scenarios
- [ ] Test on mobile devices
- [ ] Set up error logging/monitoring
- [ ] Configure security headers
- [ ] Test session persistence

## Troubleshooting

### Dashboard not displaying
- Ensure Tailwind CSS is properly configured
- Check that Framer Motion and lucide-react are installed
- Verify React 18+ is being used

### Polling not working
- Check API endpoint in `.env`
- Ensure CORS headers are set correctly
- Verify API returns correct status format

### Animations not smooth
- Check browser hardware acceleration
- Reduce animation complexity if needed
- Verify GPU usage in DevTools

### Session not persisting
- Check localStorage is enabled in browser
- Verify no browser privacy mode is active
- Check for storage quota issues

## License

This dashboard is ready for production use. Customize as needed for your requirements.

## Support

For issues or questions about the implementation, refer to the component documentation inline in the source files.

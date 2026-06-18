# Quick Start Guide

## 1. Installation

Make sure all dependencies are installed:

```bash
npm install
npm install framer-motion lucide-react
```

## 2. Configuration

Create `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Replace with your actual API endpoint.

## 3. Start Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## 4. File Structure

All dashboard files have been created in:

```
src/
├── api/validationApi.js                    # API client
├── hooks/useValidationSession.js           # Session management
├── components/
│   ├── Dashboard.jsx                       # Main component
│   ├── UploadZone.jsx                      # Upload area
│   ├── StatusBadge.jsx                     # Status indicator
│   ├── StatsCards.jsx                      # Statistics
│   ├── ProgressSection.jsx                 # Progress tracking
│   ├── ChunksTable.jsx                     # Chunks list
│   ├── SuccessBanner.jsx                   # Success state
│   ├── ErrorState.jsx                      # Error handling
│   └── LoadingSkeleton.jsx                 # Loading states
└── App.jsx                                 # Entry point (updated)
```

## 5. Features Overview

### Upload
- Drag & drop CSV files
- File validation (type & size)
- Upload progress indicator

### Validation
- Real-time status updates
- Live progress tracking
- Animated statistics

### Results
- Success banner with confetti
- Download invalid rows
- Download validated chunks
- Session persistence

## 6. API Requirements

Your backend must provide these endpoints:

### POST /api/v1/upload
Upload a CSV file
- Input: FormData with `file`
- Output: `{ session_id, original_filename, status, ... }`

### GET /api/v1/upload/{session_id}/status
Get validation status
- Output: `{ session_id, status, total_rows, valid_rows, error_rows, chunks }`

### GET /api/v1/upload/{session_id}/chunks
Get list of chunks
- Output: `{ chunks: [...] }`

### GET /api/v1/upload/{session_id}/chunks/{chunk_id}/download
Download a chunk file
- Output: CSV file blob

### GET /api/v1/upload/{session_id}/download/invalid
Download invalid rows
- Output: CSV file blob

## 7. Testing

### Test Upload
1. Open dashboard
2. Drag a CSV file or click "Browse Files"
3. See upload progress
4. Watch real-time validation updates

### Test Session Persistence
1. Upload a file
2. Refresh the page
3. Dashboard restores session and continues polling

### Test Error Handling
1. Try uploading a non-CSV file
2. See error message
3. Click "Try Again"

## 8. Customization

### Change Colors
Edit `statusConfig` in components to change theme colors

### Change Polling Interval
Edit `POLLING_INTERVAL` in `useValidationSession.js` (default: 2000ms)

### Change Upload Limit
Edit `maxSize` in `useValidationSession.js` (default: 50MB)

## 9. Production Build

```bash
npm run build
```

Output will be in `dist/` directory

Deploy with:
- Vercel: `vercel deploy`
- Netlify: `netlify deploy --prod`
- AWS S3: `aws s3 sync dist/ s3://bucket-name`

## 10. Environment Variables

Required:
- `VITE_API_URL` - Your API endpoint

Optional:
- `VITE_DEBUG` - Enable debug logging

## 11. Browser Support

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

## 12. Performance Tips

- Use gzip compression
- Enable caching headers
- Optimize images
- Use CDN for assets
- Monitor Core Web Vitals

## 13. Common Issues

### API calls failing
- Check `VITE_API_URL` is correct
- Verify CORS headers on backend
- Check network tab in DevTools

### Styles not loading
- Ensure Tailwind CSS is built
- Check `tailwind.config.js`
- Verify CSS imports

### Animations choppy
- Check GPU acceleration
- Reduce animation count
- Update browser

## 14. Next Steps

1. Implement your backend API
2. Test with real CSV files
3. Configure error logging
4. Set up monitoring
5. Deploy to production

## Support

Refer to:
- `DASHBOARD_README.md` for detailed documentation
- Component source code for implementation details
- API documentation for endpoint specs

---

**Ready to go!** Your beautiful CSV validation dashboard is fully implemented and ready for use.

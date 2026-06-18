# CSV Validation API Specification

This document specifies the backend API endpoints required for the CSV Validation Dashboard.

## Base URL

```
http://localhost:3000/api/v1
```

Or your production URL configured in `.env`:
```
VITE_API_URL=https://api.yourdomain.com/api/v1
```

## Endpoints

### 1. Upload CSV File

**Endpoint:** `POST /upload`

**Description:** Upload a CSV file for validation

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  ```
  file: <CSV file>
  ```

**Response (200):**
```json
{
  "session_id": "8d5f2b3d-7f3f-4b0c-9c1c-123456789abc",
  "original_filename": "orders.csv",
  "file_size_bytes": 10240,
  "status": "pending",
  "message": "Upload received. Validation started.",
  "poll_status_url": "/api/v1/upload/8d5f2b3d-7f3f-4b0c-9c1c-123456789abc/status"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid file format",
  "message": "Only CSV files are accepted"
}
```

**Error Response (413):**
```json
{
  "error": "File too large",
  "message": "Maximum file size is 50MB"
}
```

### 2. Get Validation Status

**Endpoint:** `GET /upload/{session_id}/status`

**Description:** Get current validation status and progress

**Request:**
- Method: `GET`
- Path Parameter: `session_id` (required)

**Response (200):**
```json
{
  "session_id": "8d5f2b3d-7f3f-4b0c-9c1c-123456789abc",
  "original_filename": "orders.csv",
  "file_size_bytes": 10240,
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
    },
    {
      "chunk_id": "chunk-id-2",
      "chunk_index": 2,
      "row_count": 500,
      "filename": "chunk_2.csv"
    }
  ]
}
```

**Status Values:**
- `pending` - Waiting to be processed
- `processing` - Currently validating
- `validating` - Final validation stage
- `validated` - Validation complete, success
- `failed` - Validation failed
- `error` - System error

**Error Response (404):**
```json
{
  "error": "Session not found",
  "message": "Session ID does not exist"
}
```

### 3. Get Chunks List

**Endpoint:** `GET /upload/{session_id}/chunks`

**Description:** Get list of all chunks for a session

**Request:**
- Method: `GET`
- Path Parameter: `session_id` (required)

**Response (200):**
```json
{
  "session_id": "8d5f2b3d-7f3f-4b0c-9c1c-123456789abc",
  "chunks": [
    {
      "chunk_id": "chunk-id-1",
      "chunk_index": 1,
      "row_count": 500,
      "filename": "chunk_1.csv",
      "created_at": "2024-06-18T10:30:00Z"
    },
    {
      "chunk_id": "chunk-id-2",
      "chunk_index": 2,
      "row_count": 500,
      "filename": "chunk_2.csv",
      "created_at": "2024-06-18T10:30:15Z"
    }
  ]
}
```

**Error Response (404):**
```json
{
  "error": "Session not found",
  "message": "Session ID does not exist"
}
```

### 4. Download Chunk File

**Endpoint:** `GET /upload/{session_id}/chunks/{chunk_id}/download`

**Description:** Download a validated chunk file

**Request:**
- Method: `GET`
- Path Parameters:
  - `session_id` (required)
  - `chunk_id` (required)

**Response (200):**
- Content-Type: `text/csv`
- Content-Disposition: `attachment; filename="chunk_1.csv"`
- Body: CSV file content

**Error Response (404):**
```json
{
  "error": "Chunk not found",
  "message": "Chunk ID does not exist for this session"
}
```

### 5. Download Invalid Rows

**Endpoint:** `GET /upload/{session_id}/download/invalid`

**Description:** Download all rows that failed validation

**Request:**
- Method: `GET`
- Path Parameter: `session_id` (required)

**Response (200):**
- Content-Type: `text/csv`
- Content-Disposition: `attachment; filename="invalid-rows-{session_id}.csv"`
- Body: CSV file with invalid rows

**Format:** Include original row data plus error reason column

**Error Response (404):**
```json
{
  "error": "No invalid rows found",
  "message": "All rows validated successfully"
}
```

## Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input data |
| 404 | Not Found | Resource not found |
| 413 | Payload Too Large | File exceeds size limit |
| 500 | Server Error | Internal server error |
| 503 | Service Unavailable | Service temporarily down |

## CORS Configuration

Required headers for browser requests:

```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

## Session Lifecycle

```
1. User uploads CSV
   └─ POST /upload → session_id created, status: "pending"

2. Polling starts (every 2 seconds)
   └─ GET /upload/{session_id}/status
   
3. Status progresses
   └─ pending → processing → validating
   
4. Chunks created and stored
   └─ Chunks array populated in status response
   
5. Validation completes
   └─ Status becomes "validated" or "failed"
   
6. User downloads results
   ├─ GET /chunks/{chunk_id}/download
   └─ GET /download/invalid
   
7. Session cleanup (optional)
   └─ DELETE /upload/{session_id} (recommended)
```

## Implementation Notes

### File Size Limits
- Maximum recommended: 50MB
- Frontend enforces this limit
- Backend should also validate

### Row Processing
- Process CSV row by row
- Collect errors for invalid rows
- Store chunks for downloads
- Update status in real-time

### Storage Requirements
- Store chunks temporarily
- Store invalid rows report
- Clean up after configured retention period
- Consider cleanup after 24-48 hours

### Performance Considerations
- Stream large files
- Process in batches
- Update status frequently (every 1-2 seconds)
- Return only necessary data

### Error Messages
Should be clear and actionable:
- ❌ "Invalid: Missing required column 'email'"
- ✅ Good: "Row 42: Email field cannot be empty"
- ✅ Good: "Invalid email format in row 15: 'user@invalid'"

## Testing

### Test Endpoints with curl

```bash
# Upload
curl -X POST -F "file=@orders.csv" \
  http://localhost:3000/api/v1/upload

# Get status
curl http://localhost:3000/api/v1/upload/{session_id}/status

# Get chunks
curl http://localhost:3000/api/v1/upload/{session_id}/chunks

# Download chunk
curl http://localhost:3000/api/v1/upload/{session_id}/chunks/{chunk_id}/download \
  > chunk_1.csv

# Download invalid rows
curl http://localhost:3000/api/v1/upload/{session_id}/download/invalid \
  > invalid_rows.csv
```

### Test with Postman

1. Create collection with endpoints above
2. Set base URL variable
3. Add session_id variable for testing
4. Save test responses

## Rate Limiting

Recommended rates:
- Upload: 1 request per 5 seconds per user
- Status poll: 30 requests per minute per session
- Download: 10 requests per minute per session

## Authentication (Optional)

If requiring auth, add to all requests:

```
Authorization: Bearer {token}
```

## Examples

### Example 1: Complete Flow

```javascript
// 1. Upload
POST /upload
FormData: { file: orders.csv }
Response: { session_id: "abc123", status: "pending" }

// 2. Poll status (2 second intervals)
GET /upload/abc123/status
Response: { status: "processing", valid_rows: 500, error_rows: 10 }

// 3. When complete
GET /upload/abc123/status
Response: { status: "validated", chunks: [...], valid_rows: 950, error_rows: 50 }

// 4. Download results
GET /upload/abc123/chunks/chunk-1/download
GET /upload/abc123/download/invalid
```

### Example 2: Error Handling

```javascript
// Invalid file type
POST /upload
FormData: { file: orders.txt }
Response (400): { error: "Invalid file format", message: "Only CSV files are accepted" }

// Session not found
GET /upload/invalid_id/status
Response (404): { error: "Session not found", message: "Session ID does not exist" }
```

## Migration Guide

If migrating from another API:

1. Map old endpoints to new structure
2. Ensure response format matches exactly
3. Test status transitions
4. Verify chunk creation
5. Test error scenarios
6. Update client configuration

## Support

For integration questions:
- Review the Dashboard source code
- Check API response formats
- Test with provided curl examples
- Verify CORS configuration

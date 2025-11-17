# API Routes Setup - Dev & Production Compatibility

This document explains how the Next.js API routes are configured to work in both development and production environments.

## Overview

The frontend uses Next.js API routes that proxy requests to the backend server. This allows:
- **Development**: Frontend (localhost:3000) → Next.js API routes → Backend (localhost:3001)
- **Production**: Frontend (jasonolefson.com) → Next.js API routes → Backend (production URL)

## Environment Variables

All API routes use the same environment variable pattern:

```typescript
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
```

### Development Setup

In development, create a `.env.local` file (already gitignored):

```env
# Optional - defaults to localhost:3001 if not set
BACKEND_URL=http://localhost:3001
```

### Production Setup

In production (Vercel, etc.), set the environment variable:

```env
BACKEND_URL=https://api.jasonolefson.com
# OR
NEXT_PUBLIC_API_URL=https://api.jasonolefson.com
```

**Note**: `NEXT_PUBLIC_*` variables are exposed to the browser, while `BACKEND_URL` is server-only (more secure).

## API Routes Created

### Projects
- ✅ `/api/projects` - GET, POST
- ✅ `/api/projects/[id]` - GET, PUT, DELETE
- ✅ `/api/projects/featured` - GET, POST

### Tools
- ✅ `/api/tools` - GET, POST
- ✅ `/api/tools/[id]` - GET, PUT, DELETE
- ✅ `/api/tools/[id]/usecases` - POST
- ✅ `/api/tools/[id]/usecases/[ucIndex]` - PUT, DELETE

### Processes
- ✅ `/api/processes` - GET, POST
- ✅ `/api/processes/[id]` - GET, PUT, DELETE

## How It Works

1. **Client-side requests** (browser):
   - Frontend code calls `/api/tools` (relative URL)
   - Next.js API route receives the request
   - Route proxies to `${BACKEND_URL}/api/tools`
   - Response is returned to the client

2. **Server-side requests** (SSR):
   - Next.js server components call the API routes
   - Same proxying mechanism applies
   - Uses `BACKEND_URL` from environment

## Benefits

- ✅ **Separation**: Dev and production use different backend URLs
- ✅ **Security**: Backend URL not exposed to browser (when using `BACKEND_URL`)
- ✅ **Flexibility**: Easy to switch between environments
- ✅ **CORS**: No CORS issues since requests go through Next.js server

## Troubleshooting

**404 errors on API routes?**
- Check that the Next.js API route file exists
- Verify the route path matches the file structure
- Check browser console for specific error messages

**Backend connection errors?**
- Verify `BACKEND_URL` is set correctly
- Ensure backend server is running (dev) or accessible (production)
- Check network tab for failed requests

**Production not working?**
- Set `BACKEND_URL` in your hosting platform's environment variables
- Restart the deployment after setting environment variables
- Verify the production backend URL is correct










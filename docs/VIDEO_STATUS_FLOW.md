# Video Status Flow Analysis - Our Tube Next

## Overview

This document explains how video status flows from creation through Mux webhooks to the frontend display.

## 1. Database Schema

**Location**: `src/db/schema.ts`

Key fields in `videos` table:

```typescript
muxStatus: text("mux_status")              // Status: waiting, preparing, ready, errored
muxAssetId: text("mux_asset_id").unique()  // Mux asset ID
muxUploadId: text("mux_upload_id").unique()// Links to upload, used by webhooks
muxPlaybackId: text("mux_playback_id")     // For video playback
muxTrackId: text("mux_track_id")           // Subtitle track ID
muxTrackStatus: text("mux_track_status")   // Subtitle status
thumbnailUrl: text("thumbnail_url")        // Thumbnail image URL
previewUrl: text("preview_url")            // Preview GIF URL
duration: integer("duration")              // Video length in ms
updatedAt: timestamp("updated_at")         // For sorting
```

Database: **Neon (Serverless Postgres)**

## 2. Mux Webhook Handler

**Location**: `src/app/api/videos/webhook/route.ts`

**Endpoint**: `POST /api/videos/webhook`

### Event Types Handled:

1. **video.asset.created**
   - Triggered when Mux receives upload
   - Updates: `muxAssetId`, `muxStatus: "preparing"`

2. **video.asset.ready**
   - Triggered when transcoding complete
   - Updates: `muxStatus: "ready"`, `muxPlaybackId`, `thumbnailUrl`, `previewUrl`, `duration`
   - Uploads thumbnail and preview to UploadThing (S3)

3. **video.asset.errored**
   - Triggered on processing failure
   - Updates: `muxStatus: "errored"`

4. **video.asset.track.ready**
   - Triggered when subtitles ready
   - Updates: `muxTrackId`, `muxTrackStatus`

5. **video.asset.deleted**
   - Deletes video record from database

### Security:
- Verifies HMAC signature using `MUX_WEBHOOK_SECRET`
- Rejects unsigned requests with 401
- Logs all events

## 3. Frontend Data Flow

### tRPC Routers

**Studio Router** (`src/modules/studio/server/procedures.ts`):
- `studio.getOne`: Fetch single video by ID
- `studio.getMany`: Infinite scroll cursor pagination of user's videos

**Videos Router** (`src/modules/videos/server/procedures.ts`):
- `videos.update`: Update video metadata (title, description, visibility, category)
- `videos.create`: Create new video upload session

All queries are protected (require authentication) and filtered by userId.

### Components

**Video List** (`src/modules/studio/ui/sections/videos-section.tsx`):
- Uses `studio.getMany` infinite query
- Displays: Title, thumbnail, status, visibility, date
- Status shows: `snakeCaseToTitle(video.muxStatus || "error")`

**Video Details** (`src/modules/studio/ui/sections/form-section.tsx`):
- Uses `studio.getOne` query
- Displays: Player, title, description, thumbnail, category
- Shows two statuses:
  - Video status: `snakeCaseToTitle(video.muxStatus || "preparing")`
  - Subtitles status: `snakeCaseToTitle(video.muxTrackStatus || "no_subtitles")`

## 4. Complete Flow Diagram

```
USER CREATES VIDEO
    ↓
tRPC: videos.create
    ↓
Mux.video.uploads.create()
    ↓
DB: INSERT { muxStatus: "waiting", muxUploadId }
    ↓
Frontend: User uploads file to Mux
    ↓
Mux receives upload
    ↓
Webhook: video.asset.created
    ↓
DB: UPDATE { muxAssetId, muxStatus: "preparing" }
    ↓
Mux transcodes video
    ↓
Webhook: video.asset.ready
    ↓
DB: UPDATE { muxPlaybackId, thumbnailUrl, previewUrl, duration, muxStatus: "ready" }
    ↓
Frontend fetches via studio.getOne
    ↓
User sees status "Ready" and can play video
```

## 5. Status Lifecycle

```
waiting  → preparing → ready
                    ↓
                 errored (if error occurs)
```

## 6. Critical Issues Found

### Issue 1: No Real-Time Status Updates
**Problem**: Status only updates when user refreshes or performs action
**Impact**: User uploads video but page still shows "waiting" for minutes
**Solution**: Implement polling or WebSocket

### Issue 2: Typo in Workflow
**File**: `src/app/api/videos/workflows/title/route.ts` line 19
**Bug**: `body: { userId, vidoeId: input.id }`
**Fix**: Change `vidoeId` to `videoId`

### Issue 3: Typo in Webhook Response
**File**: `src/app/api/videos/webhook/route.ts` line 102
**Bug**: `"Miissing playback ID"`
**Fix**: Should be "Missing"

### Issue 4: Weak Type Safety
**Problem**: `muxStatus` is generic text field, can be any string
**Solution**: Use pgEnum for type safety:
```typescript
export const muxStatusEnum = pgEnum("mux_status", [
  "waiting", "preparing", "ready", "errored"
]);
```

### Issue 5: UploadThing Failures
**Problem**: If thumbnail upload fails, entire webhook fails
**Scenario**: Video ready but thumbnail upload error → webhook 500 → database not updated
**Fix**: Implement retry logic or partial success handling

### Issue 6: Missing Error Details
**Problem**: Error messages from Mux webhook are logged but not stored
**Solution**: Add `muxErrorMessage: text` field to store error details

### Issue 7: No Webhook Monitoring
**Problem**: No tracking of webhook failures
**Impact**: Can't detect if webhooks are silently failing
**Solution**: Add webhook event logging table

### Issue 8: No Idempotency
**Problem**: If webhook fires twice, updates happen twice
**Solution**: Add idempotency key handling

## 7. Key Files Summary

```
Database:
  src/db/schema.ts                  - Video table definition
  src/db/index.ts                   - Database connection

Webhook:
  src/app/api/videos/webhook/route.ts - Webhook handler

API:
  src/modules/studio/server/procedures.ts  - Studio queries
  src/modules/videos/server/procedures.ts  - Video mutations

Frontend:
  src/modules/studio/ui/sections/videos-section.tsx  - List view
  src/modules/studio/ui/sections/form-section.tsx    - Detail view

Config:
  src/lib/mux.ts                    - Mux SDK init
  src/lib/workflow.ts               - Upstash Workflow init
  package.json                      - Dependencies
```

## 8. Environment Variables

```
DATABASE_URL              - Neon Postgres
MUX_TOKEN_ID             - Mux API credentials
MUX_TOKEN_SECRET         - Mux API credentials
MUX_WEBHOOK_SECRET       - For webhook signature verification
UPLOADTHING_TOKEN        - UploadThing API
QSTASH_TOKEN            - Upstash Workflow
```

## 9. How to Test Webhook Locally

The project uses ngrok for local testing:
```bash
npm run dev:webhook        # Starts ngrok tunnel
npm run dev:all           # Runs dev server + ngrok
```

Then configure Mux webhook to send to ngrok URL.

## 10. Data Flow Summary

1. **User Action**: Creates video
2. **Database**: Stores with status "waiting" + muxUploadId
3. **File Upload**: User uploads to Mux
4. **Webhook 1**: asset.created → DB updates muxAssetId + status "preparing"
5. **Mux Processing**: Transcodes video (no webhook)
6. **Webhook 2**: asset.ready → DB updates muxPlaybackId, thumbnails, status "ready"
7. **Webhook 3**: track.ready → DB updates muxTrackId + track status
8. **Frontend**: Queries DB, displays status and player

## Recommendations

**High Priority**:
1. Fix typos (vidoeId, Miissing)
2. Implement real-time status updates
3. Use pgEnum for muxStatus
4. Handle UploadThing failures gracefully

**Medium Priority**:
1. Store error messages
2. Add webhook monitoring
3. Make webhook handlers idempotent

**Low Priority**:
1. Add status history
2. Implement WebSocket for live updates
3. Add structured logging


import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetDeletedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks";
import { mux } from "@/lib/mux";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { UTApi } from "uploadthing/server";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetTrackReadyWebhookEvent
  | VideoAssetDeletedWebhookEvent;

export const POST = async (request: Request) => {
  console.log("🔔 Mux webhook received");

  if (!SIGNING_SECRET) {
    throw new Error("MUX_WEBHOOK_SECRET is not set");
  }

  const headersPayload = await headers();
  const muxSignature = headersPayload.get("mux-signature");

  if (!muxSignature) {
    console.error("❌ No signature found");
    return new Response("No signature found", { status: 401 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  console.log("📦 Webhook type:", payload.type);
  console.log("📦 Webhook data:", payload.data);

  try {
    mux.webhooks.verifySignature(
      body,
      {
        "mux-signature": muxSignature,
      },
      SIGNING_SECRET
    );
    console.log("✅ Signature verified");
  } catch (error) {
    console.error("❌ Signature verification failed:", error);
    return new Response("Invalid signature", { status: 401 });
  }

  switch (payload.type as WebhookEvent["type"]) {
    case "video.asset.created": {
      const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

      if (!data.upload_id) {
        console.error("❌ No upload ID found");
        return new Response("No upload ID found", { status: 400 });
      }

      console.log("✅ Creating video with upload_id:", data.upload_id);

      await db
        .update(videos)
        .set({
          muxAssetId: data.id,
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));

      console.log("✅ Video created");
      break;
    }
    case "video.asset.ready": {
      console.log("🎥 Processing video.asset.ready event");

      const data = payload.data as VideoAssetReadyWebhookEvent["data"];
      const playbackId = data.playback_ids?.[0].id;

      console.log("📋 Video data:", {
        upload_id: data.upload_id,
        asset_id: data.id,
        status: data.status,
        playbackId,
        duration: data.duration,
      });

      if (!data.upload_id) {
        console.error("❌ Missing upload ID");
        return new Response("Missing upload ID", { status: 400 });
      }

      if (!playbackId) {
        console.error("❌ Missing playback ID");
        return new Response("Miissing playback ID", { status: 400 });
      }

      const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
      const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
      const duration = data.duration ? Math.round(data.duration * 1000) : 0;

      console.log("📸 Uploading thumbnail and preview to UploadThing...");
      console.log("   Thumbnail URL:", tempThumbnailUrl);
      console.log("   Preview URL:", tempPreviewUrl);

      try {
        const utapi = new UTApi();
        const [uploadedThumbnail, uploadedPreview] =
          await utapi.uploadFilesFromUrl([tempThumbnailUrl, tempPreviewUrl]);

        if (!uploadedThumbnail.data || !uploadedPreview.data) {
          console.error("❌ Failed to upload thumbnail or preview");
          console.error("   Thumbnail result:", uploadedThumbnail);
          console.error("   Preview result:", uploadedPreview);
          return new Response("Failed to upload thumbnail or preview", {
            status: 500,
          });
        }

        const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumbnail.data;
        const { key: previewKey, url: previewUrl } = uploadedPreview.data;

        console.log("✅ Upload successful:");
        console.log("   Thumbnail:", thumbnailUrl);
        console.log("   Preview:", previewUrl);

        console.log("💾 Updating database...");
        const updateResult = await db
          .update(videos)
          .set({
            muxStatus: data.status,
            muxPlaybackId: playbackId,
            muxAssetId: data.id,
            thumbnailUrl,
            previewUrl,
            duration,
          })
          .where(eq(videos.muxUploadId, data.upload_id))
          .returning();

        console.log("✅ Database updated successfully");
        console.log("   Updated rows:", updateResult.length);
        console.log("   Video status:", updateResult[0]?.muxStatus);
      } catch (error) {
        console.error("❌ Error in video.asset.ready handler:", error);
        throw error;
      }
      break;
    }
    case "video.asset.errored": {
      console.log("⚠️ Processing video.asset.errored event");

      const data = payload.data as VideoAssetErroredWebhookEvent["data"];

      console.log("📋 Error data:", {
        upload_id: data.upload_id,
        asset_id: data.id,
        status: data.status,
        errors: data.errors,
      });

      if (!data.upload_id) {
        console.error("❌ Missing upload ID");
        return new Response("Missing upload ID", { status: 400 });
      }

      console.log("💾 Updating video status to errored...");
      await db
        .update(videos)
        .set({
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));

      console.log("✅ Video marked as errored");
      break;
    }

    case "video.asset.deleted": {
      const data = payload.data as VideoAssetDeletedWebhookEvent["data"];

      if (!data.upload_id) {
        return new Response("Missing upload ID", { status: 400 });
      }

      console.log("Deleting video: ", { uploadId: data.upload_id });

      await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));
      break;
    }

    case "video.asset.track.ready": {
      const data = payload.data as VideoAssetReadyWebhookEvent["data"] & {
        asset_id: string;
      };

      console.log("Track ready");

      // 타입스크립트가 asset_id가 존재하지 않는다고 잘못 표시함
      const assetId = data.asset_id;
      const trackId = data.id;
      const status = data.status;

      if (!assetId) {
        return new Response("Missing asset ID", { status: 400 });
      }

      await db
        .update(videos)
        .set({
          muxTrackId: trackId,
          muxTrackStatus: status,
        })
        .where(eq(videos.muxAssetId, assetId));
      break;
    }
  }

  return new Response("Webhook received", { status: 200 });
};

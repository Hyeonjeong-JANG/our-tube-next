// Mux 웹훅을 시뮬레이션하여 테스트
import { db } from "../src/db/index";
import { videos } from "../src/db/schema";
import { eq } from "drizzle-orm";

const UPLOAD_ID = "1cESfmuquEmE9RZb7HHouEZKeALxMzOYJGGkswfsnfM"; // 최신 비디오의 업로드 ID

async function testWebhookUpdate() {
  console.log("🧪 Testing webhook update simulation...\n");

  // 1. video.asset.created 시뮬레이션
  console.log("1️⃣ Simulating video.asset.created webhook...");
  const result1 = await db
    .update(videos)
    .set({
      muxAssetId: "TEST_ASSET_ID_123",
      muxStatus: "preparing",
    })
    .where(eq(videos.muxUploadId, UPLOAD_ID))
    .returning();

  if (result1.length === 0) {
    console.log("❌ No video found with upload ID:", UPLOAD_ID);
    return;
  }

  console.log("✅ Updated to 'preparing'");
  console.log("   Asset ID:", result1[0].muxAssetId);
  console.log("   Status:", result1[0].muxStatus);
  console.log("");

  // 2. video.asset.ready 시뮬레이션
  console.log("2️⃣ Simulating video.asset.ready webhook...");
  const result2 = await db
    .update(videos)
    .set({
      muxStatus: "ready",
      muxPlaybackId: "TEST_PLAYBACK_ID_456",
      thumbnailUrl: "https://image.mux.com/TEST_PLAYBACK_ID_456/thumbnail.jpg",
      previewUrl: "https://image.mux.com/TEST_PLAYBACK_ID_456/animated.gif",
      duration: 60000, // 60초
    })
    .where(eq(videos.muxUploadId, UPLOAD_ID))
    .returning();

  console.log("✅ Updated to 'ready'");
  console.log("   Playback ID:", result2[0].muxPlaybackId);
  console.log("   Status:", result2[0].muxStatus);
  console.log("   Thumbnail:", result2[0].thumbnailUrl);
  console.log("");

  console.log("✅ Webhook simulation completed!");
  console.log("📱 Now refresh your browser to see 'Ready' status");

  process.exit(0);
}

testWebhookUpdate().catch(console.error);

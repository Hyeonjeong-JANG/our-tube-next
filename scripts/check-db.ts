import { db } from "../src/db/index";
import { videos } from "../src/db/schema";
import { desc } from "drizzle-orm";

async function checkDB() {
  console.log("🔍 Checking latest videos in database...\n");

  const latestVideos = await db
    .select({
      id: videos.id,
      title: videos.title,
      muxStatus: videos.muxStatus,
      muxUploadId: videos.muxUploadId,
      muxAssetId: videos.muxAssetId,
      muxPlaybackId: videos.muxPlaybackId,
      thumbnailUrl: videos.thumbnailUrl,
      updatedAt: videos.updatedAt,
    })
    .from(videos)
    .orderBy(desc(videos.updatedAt))
    .limit(5);

  if (latestVideos.length === 0) {
    console.log("❌ No videos found in database");
    return;
  }

  console.log(`Found ${latestVideos.length} videos:\n`);

  latestVideos.forEach((video, index) => {
    console.log(`📹 Video ${index + 1}:`);
    console.log(`   ID: ${video.id}`);
    console.log(`   Title: ${video.title}`);
    console.log(`   Status: ${video.muxStatus || 'NULL'}`);
    console.log(`   Upload ID: ${video.muxUploadId || 'NULL'}`);
    console.log(`   Asset ID: ${video.muxAssetId || 'NULL'}`);
    console.log(`   Playback ID: ${video.muxPlaybackId || 'NULL'}`);
    console.log(`   Thumbnail: ${video.thumbnailUrl ? 'YES' : 'NO'}`);
    console.log(`   Updated: ${video.updatedAt}`);
    console.log('');
  });

  // 문제가 있는 비디오 찾기
  const problematicVideos = latestVideos.filter(v =>
    v.muxAssetId && !v.muxPlaybackId && v.muxStatus === 'waiting'
  );

  if (problematicVideos.length > 0) {
    console.log('⚠️  Found videos with muxAssetId but no muxPlaybackId:');
    problematicVideos.forEach(v => {
      console.log(`   - ${v.title} (${v.id})`);
      console.log(`     Status: ${v.muxStatus}`);
      console.log(`     Asset ID: ${v.muxAssetId}`);
    });
  }

  process.exit(0);
}

checkDB().catch(console.error);

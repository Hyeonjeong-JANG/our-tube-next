// 이 파일의 경로는 http://localhost:3000/api/videos/workflows/title와 동일하고 videos api 내에서 title을 처리하는 workflow이다.
import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { tr } from "date-fns/locale";
import { and, eq } from "drizzle-orm";

interface InputType {
  userId: string;
  videoId: string;
}

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId, userId } = input;

  // 이건 시연목적으로만 사용되고 실제 워크플로우에서는 필요없음
  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), and(eq(videos.userId, userId))));

    if (!existingVideo) {
      throw new Error("Not found");
    }

    return existingVideo;
  });

  // 이것만 있어도 된다
  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({ title: "Updated from background job" })
      .where(
        and(eq(videos.id, video.id), and(eq(videos.userId, video.userId)))
      );
  });
});

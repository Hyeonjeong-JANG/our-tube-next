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
  const existingVideo = context.run("get-video", async () => {
    const data = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), and(eq(videos.userId, userId))));

    if (!data[0]) {
      throw new Error("Not found");
    }

    return data[0];
  });

  console.log({ existingVideo });

  await context.run("first-step", () => {
    console.log("first step ran");
  });

  await context.run("second-step", () => {
    console.log("second step ran");
  });
});

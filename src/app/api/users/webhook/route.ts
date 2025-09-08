import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { db } from "@/db"
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const eventType = evt.type

    // 유저 생성
    if (eventType === "user.created") {
      const { data } = evt
      await db.insert(users).values({
        clerkId: data.id,
        name: `${data.first_name} ${data.last_name}`, // 구글 로그인을 사용하지 않으면 이 부분이 null이 들어갈지도 모르니까 구글 로그인을 사용하는 것이 좋다.
        imageUrl: data.image_url,
      })
    }

    // 유저 삭제
    if (eventType === "user.deleted") {
      const { data } = evt;

      if (!data.id) {
        return new Response("사용자 아이디가 없습니다.", { status: 400 });
      }

      await db.delete(users).where(eq(users.clerkId, data.id));
    }

    // 유저 업데이트
    if (eventType === "user.updated") {
      const { data } = evt;

      // 수정하지 않을 유일한 항목은 clerkId 뿐이다.
      await db
        .update(users)
        .set({
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        })
        .where(eq(users.clerkId, data.id)); // clerkId를 기준으로 업데이트
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}
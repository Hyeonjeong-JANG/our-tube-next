# 🔍 Mux Webhook 디버깅 가이드

## 문제 상황

- **현상:** Studio 페이지에서 비디오 상태가 "Waiting"으로 표시됨
- **예상:** Mux 대시보드에서는 "Ready" 상태인데 앱에 반영 안 됨
- **원인:** Mux 웹훅이 제대로 동작하지 않아 데이터베이스가 업데이트되지 않음

---

## 디버깅 로그 추가 완료 ✅

다음 파일에 상세한 로그가 추가되었습니다:
- `src/app/api/videos/webhook/route.ts`

### 추가된 로그:

1. **웹훅 수신 확인**
   - 🔔 Mux webhook received
   - 📦 Webhook type
   - 📦 Webhook data

2. **video.asset.ready 이벤트** (가장 중요!)
   - 🎥 Processing video.asset.ready event
   - 📋 Video data (upload_id, asset_id, status, playbackId, duration)
   - 📸 Uploading thumbnail and preview to UploadThing
   - ✅ Upload successful (또는 ❌ Failed)
   - 💾 Updating database
   - ✅ Database updated successfully (Updated rows, Video status)

3. **video.asset.errored 이벤트**
   - ⚠️ Processing video.asset.errored event
   - 📋 Error data (upload_id, asset_id, status, errors)

---

## 디버깅 단계

### 1단계: 개발 서버 재시작

로그가 적용되도록 서버를 재시작하세요:

```bash
# 기존 프로세스 종료 (Ctrl+C)
# 그리고 다시 실행:
npm run dev:all
```

### 2단계: ngrok 상태 확인

**ngrok이 실행 중인지 확인:**

```bash
# ngrok 프로세스 확인
# PowerShell:
Get-Process | Where-Object {$_.ProcessName -like "*ngrok*"}

# 또는 새 터미널에서:
ngrok http 3000
```

**ngrok URL 확인:**
- 터미널에 표시되는 `https://xxxx-xxx-xxx-xxx-xxx.ngrok-free.app` URL을 확인
- 이 URL이 Mux 대시보드에 설정된 웹훅 URL과 일치하는지 확인

### 3단계: Mux 대시보드 확인

1. **Mux 대시보드 접속:** https://dashboard.mux.com
2. **Settings → Webhooks** 이동
3. **웹훅 URL 확인:**
   - 올바른 형식: `https://your-ngrok-url.ngrok-free.app/api/videos/webhook`
   - ⚠️ ngrok URL은 재시작할 때마다 변경됩니다!
4. **웹훅 이벤트 확인:**
   - `video.asset.created` ✅
   - `video.asset.ready` ✅ (가장 중요!)
   - `video.asset.errored` ✅
   - `video.asset.deleted` ✅

### 4단계: 웹훅 테스트

**Mux에서 수동으로 웹훅 재전송:**

1. Mux 대시보드 → Settings → Webhooks → Recent deliveries
2. "Ready" 상태인 비디오의 `video.asset.ready` 이벤트 찾기
3. **"Resend"** 버튼 클릭
4. 개발 서버 터미널에서 로그 확인

### 5단계: 로그 분석

**성공적인 경우 보이는 로그:**

```
🔔 Mux webhook received
📦 Webhook type: video.asset.ready
📦 Webhook data: { ... }
✅ Signature verified
🎥 Processing video.asset.ready event
📋 Video data: { upload_id: '...', asset_id: '...', status: 'ready', ... }
📸 Uploading thumbnail and preview to UploadThing...
   Thumbnail URL: https://image.mux.com/.../thumbnail.jpg
   Preview URL: https://image.mux.com/.../animated.gif
✅ Upload successful:
   Thumbnail: https://utfs.io/...
   Preview: https://utfs.io/...
💾 Updating database...
✅ Database updated successfully
   Updated rows: 1
   Video status: ready
```

**실패하는 경우 보이는 로그 패턴:**

#### 패턴 1: 웹훅이 아예 안 오는 경우
```
(아무 로그도 없음)
```
**원인:** ngrok URL이 잘못되었거나 ngrok이 실행되지 않음
**해결:** ngrok 재시작 및 Mux 대시보드에 URL 업데이트

#### 패턴 2: 서명 검증 실패
```
🔔 Mux webhook received
❌ Signature verification failed: ...
```
**원인:** `MUX_WEBHOOK_SECRET`이 잘못되었거나 설정되지 않음
**해결:** `.env.local`에서 `MUX_WEBHOOK_SECRET` 확인

#### 패턴 3: upload_id 없음
```
🎥 Processing video.asset.ready event
❌ Missing upload ID
```
**원인:** Mux 이벤트 데이터에 `upload_id`가 없음 (드물음)
**해결:** 비디오를 다시 업로드하거나 Mux 지원팀에 문의

#### 패턴 4: UploadThing 업로드 실패
```
📸 Uploading thumbnail and preview to UploadThing...
❌ Failed to upload thumbnail or preview
   Thumbnail result: { ... }
   Preview result: { ... }
```
**원인:** UploadThing API 키가 잘못되었거나 네트워크 오류
**해결:** `.env.local`에서 `UPLOADTHING_SECRET` 및 `UPLOADTHING_APP_ID` 확인

#### 패턴 5: 데이터베이스 업데이트 실패
```
💾 Updating database...
❌ Error in video.asset.ready handler: ...
```
**원인:** 데이터베이스 연결 오류 또는 스키마 불일치
**해결:** `DATABASE_URL` 확인, Drizzle 마이그레이션 재실행

---

## 일반적인 해결 방법

### 문제 1: ngrok URL이 계속 바뀜

**증상:** ngrok을 재시작할 때마다 URL이 변경되어 Mux 대시보드에서 업데이트해야 함

**해결책:**

**옵션 A - ngrok 유료 플랜 (추천)**
- Static domain 제공
- URL이 변경되지 않음
- 가격: 월 $8

**옵션 B - 로컬에서 테스트 스크립트 작성**

Mux 웹훅을 수동으로 트리거하는 스크립트:

```bash
# test-webhook.sh
curl -X POST http://localhost:3000/api/videos/webhook \
  -H "Content-Type: application/json" \
  -H "mux-signature: t=...,v1=..." \
  -d '{"type":"video.asset.ready","data":{...}}'
```

**옵션 C - 프로덕션 배포**
- Vercel에 배포하면 고정 URL 제공
- 웹훅 URL: `https://your-app.vercel.app/api/videos/webhook`

### 문제 2: 데이터베이스에 upload_id가 없음

**증상:** 웹훅이 오지만 `upload_id`로 비디오를 찾지 못함

**원인:** 비디오 생성 시 `muxUploadId`가 저장되지 않음

**확인 방법:**

```bash
# PostgreSQL에 직접 접속하여 확인
npx drizzle-kit studio
```

비디오 테이블에서 `muxUploadId` 컬럼이 `null`인지 확인

**해결:** 비디오 생성 로직 확인

### 문제 3: 웹훅은 오는데 화면에 반영 안 됨

**증상:** 로그에 "✅ Database updated successfully"가 보이지만 Studio 페이지에는 여전히 "Waiting"

**원인:** 프론트엔드 캐싱 또는 새로고침 필요

**해결:**
1. 브라우저 새로고침 (F5 또는 Ctrl+R)
2. tRPC 쿼리 캐시 무효화 (자동이지만 지연될 수 있음)
3. 브라우저 개발자 도구 → Application → Clear storage

---

## 환경 변수 체크리스트

다음 환경 변수가 `.env.local`에 올바르게 설정되어 있는지 확인:

```env
# Mux
MUX_TOKEN_ID=xxxxx
MUX_TOKEN_SECRET=xxxxx
MUX_WEBHOOK_SECRET=xxxxx  # ⚠️ 이게 가장 중요!

# UploadThing
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=xxxxx

# Database
DATABASE_URL=postgresql://...
```

**MUX_WEBHOOK_SECRET 찾는 방법:**
1. Mux 대시보드 → Settings → Webhooks
2. 웹훅 생성 시 제공된 "Signing Secret" 복사
3. `.env.local`에 붙여넣기

---

## 다음 단계

1. ✅ **로그 확인:** 위 단계를 따라 로그를 확인하세요
2. 📋 **결과 공유:** 어떤 로그가 보이는지, 어떤 패턴인지 알려주세요
3. 🔧 **문제 해결:** 로그를 기반으로 정확한 원인을 파악하고 해결하겠습니다

---

## 추가 리소스

- [Mux Webhooks 문서](https://docs.mux.com/guides/video/listen-for-webhooks)
- [ngrok 문서](https://ngrok.com/docs)
- [UploadThing 문서](https://docs.uploadthing.com/)
- [Drizzle ORM 문서](https://orm.drizzle.team/)

---

**작성일:** 2025-01-11
**최종 업데이트:** 2025-01-11

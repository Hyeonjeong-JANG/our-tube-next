# 프로젝트 구조

```
our-tube-next/
├── .claude/                       # Claude Code 설정
├── .vscode/                       # VS Code 설정
├── assets/                        # 정적 에셋
│   └── demos/                    # README용 데모 GIF
│       ├── demo-browse-videos.gif
│       ├── demo-change-thumbnail.gif
│       └── demo-upload-video.gif
├── docs/                          # 프로젝트 문서
├── public/                        # Next.js 정적 파일
├── scripts/                       # 유틸리티 스크립트
│   ├── check-db.ts               # DB 상태 확인
│   └── test-webhook.ts           # 웹훅 테스트
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # 인증 페이지 그룹
│   │   │   ├── sign-in/         # 로그인
│   │   │   └── sign-up/         # 회원가입
│   │   ├── (home)/              # 홈 페이지 그룹
│   │   │   └── page.tsx         # 메인 페이지
│   │   ├── (studio)/            # 스튜디오 그룹
│   │   │   └── studio/
│   │   │       ├── page.tsx     # 비디오 목록
│   │   │       └── videos/[videoId]/
│   │   │           └── page.tsx # 비디오 상세/수정
│   │   ├── feed/                # 피드 페이지
│   │   │   ├── page.tsx         # 전체 피드
│   │   │   └── [videoId]/       # 비디오 시청
│   │   ├── api/                 # API 라우트
│   │   │   ├── trpc/           # tRPC 엔드포인트
│   │   │   ├── uploadthing/    # UploadThing 핸들러
│   │   │   ├── users/          # Clerk 웹훅
│   │   │   │   └── webhook/
│   │   │   └── videos/         # Mux 웹훅 & 워크플로우
│   │   │       ├── webhook/
│   │   │       └── workflows/
│   │   └── layout.tsx           # 루트 레이아웃
│   ├── components/              # 공통 UI 컴포넌트
│   │   ├── ui/                 # shadcn/ui 컴포넌트
│   │   ├── filter-carousel.tsx
│   │   ├── infinite-scroll.tsx
│   │   └── responsive-modal.tsx
│   ├── db/                      # 데이터베이스
│   │   ├── schema.ts           # Drizzle 스키마
│   │   └── index.ts            # DB 클라이언트
│   ├── hooks/                   # React 커스텀 훅
│   ├── lib/                     # 라이브러리 & 유틸리티
│   │   ├── mux.ts              # Mux 클라이언트
│   │   ├── redis.ts            # Upstash Redis
│   │   ├── uploadthing.ts      # UploadThing 설정
│   │   └── utils.ts            # 공통 유틸
│   ├── modules/                 # 기능별 모듈
│   │   ├── auth/               # 인증 관련
│   │   ├── categories/         # 카테고리
│   │   │   ├── server/         # tRPC 프로시저
│   │   │   └── ui/             # UI 컴포넌트
│   │   ├── home/               # 홈 관련
│   │   ├── studio/             # 스튜디오
│   │   │   ├── server/
│   │   │   └── ui/
│   │   └── videos/             # 비디오 관리
│   │       ├── constants.ts
│   │       ├── server/
│   │       └── ui/
│   └── trpc/                    # tRPC 설정
│       ├── routers/            # tRPC 라우터
│       ├── client.ts           # 클라이언트
│       ├── init.ts             # 초기화
│       └── server.ts           # 서버
├── .env.example                 # 환경변수 예제
├── .env.local                   # 환경변수 (로컬)
├── drizzle.config.ts            # Drizzle ORM 설정
├── next.config.ts               # Next.js 설정
├── package.json                 # 의존성
├── tailwind.config.ts           # Tailwind CSS 설정
└── tsconfig.json                # TypeScript 설정
```

## 주요 디렉토리 설명

### `/src/app` - App Router
- **(auth)**, **(home)**, **(studio)**: Route Group (URL에 포함되지 않음)
- **api/**: REST API 엔드포인트 (웹훅, 파일 업로드 등)
- **feed/**: 비디오 시청 페이지

### `/src/modules` - 기능 모듈
각 모듈은 **server**(백엔드 로직)와 **ui**(프론트엔드 컴포넌트)로 구분:
- **categories**: 카테고리 관리
- **studio**: 비디오 스튜디오 (업로드, 수정, 삭제)
- **videos**: 비디오 CRUD 및 웹훅 처리

### `/src/trpc` - tRPC
- **routers/**: 각 기능별 tRPC 라우터
- **client.ts**: 클라이언트 설정
- **server.ts**: 서버 설정
- **init.ts**: Rate limiting, Context 등

### `/src/db` - Database
- **schema.ts**: Drizzle ORM 스키마 (users, videos, categories)
- **index.ts**: Neon PostgreSQL 클라이언트

### `/src/lib` - 라이브러리
외부 서비스 클라이언트:
- **mux.ts**: Mux 비디오 API
- **redis.ts**: Upstash Redis (Rate Limiting)
- **uploadthing.ts**: 파일 업로드 (썸네일)

## 설정 파일

- **drizzle.config.ts**: DB 마이그레이션 설정
- **next.config.ts**: Next.js 빌드 설정
- **tailwind.config.ts**: CSS 설정
- **tsconfig.json**: TypeScript 컴파일 설정

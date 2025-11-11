# 📹 데모 GIF 만들기 가이드

## 🎯 목표

프로젝트의 주요 기능을 보여주는 데모 GIF를 만들어 README에 추가합니다.

---

## 🛠️ 필요한 도구

### Windows: ScreenToGif (추천)

**다운로드:** https://www.screentogif.com/

**설치:**
1. 위 링크에서 `.msi` 파일 다운로드
2. 파일 실행하여 설치
3. 설치 완료 후 실행

### macOS: Kap

**설치:**
```bash
brew install --cask kap
```

### 크로스 플랫폼: LICEcap (가볍고 간단)

**다운로드:** https://www.cockos.com/licecap/

---

## 📋 녹화할 데모 목록

### 1. 비디오 업로드 (`demo-upload-video.gif`)

**시나리오:**
1. 홈페이지 접속 (2초)
2. "Create" 버튼 클릭 (1초)
3. 비디오 파일 드래그 앤 드롭 또는 선택 (3초)
4. 업로드 진행률 표시 (5초)
5. 제목, 설명 입력 (3초)
6. 카테고리 선택 (2초)
7. "Publish" 버튼 클릭 (1초)
8. 성공 메시지 표시 (2초)

**총 시간:** 약 19초

**녹화 팁:**
- 마우스 움직임을 천천히
- 중요한 버튼에 1초 정도 호버
- 업로드 진행 중에는 편집에서 속도 높이기

---

### 2. 비디오 탐색 (`demo-browse-videos.gif`)

**시나리오:**
1. 홈페이지 (비디오 그리드 표시) (2초)
2. 스크롤 다운하여 더 많은 비디오 표시 (3초)
3. 카테고리 필터 클릭 (2초)
4. 필터링된 비디오 표시 (2초)
5. 비디오 썸네일에 호버 → 프리뷰 GIF 재생 (3초)
6. 비디오 클릭하여 상세 페이지 이동 (2초)
7. 비디오 플레이어 재생 (5초)

**총 시간:** 약 19초

**녹화 팁:**
- 썸네일 호버 효과 명확히 보여주기
- 프리뷰 GIF가 재생되는 것 확인

---

### 3. AI 제목 생성 (`demo-ai-title-generation.gif`)

**시나리오:**
1. Studio 페이지 접속 (2초)
2. 비디오 편집 페이지 이동 (1초)
3. "Generate Title" 버튼 클릭 (1초)
4. 로딩 애니메이션 (2초)
5. AI가 생성한 제목 표시 (3초)
6. 제목 자동 업데이트 확인 (2초)
7. 완료 메시지 (2초)

**총 시간:** 약 13초

**녹화 팁:**
- AI 생성 과정의 로딩 애니메이션 포함
- 제목이 변경되는 순간 명확히 보여주기

---

## 🎬 ScreenToGif 사용법 (단계별)

### 1. 녹화 준비

1. ScreenToGif 실행
2. "Recorder" 선택
3. 빨간 프레임 창이 나타남
4. 프레임을 브라우저 창 위로 이동
5. 크기 조절 (권장: 1280x720 또는 1024x768)

### 2. 녹화 시작

1. 🔴 "Record" 버튼 클릭
2. 데모 시나리오 진행 (천천히, 명확하게)
3. ⏸️ "Stop" 버튼 클릭

### 3. 편집 (중요!)

**불필요한 프레임 삭제:**
- 시작 부분과 끝 부분의 불필요한 프레임 선택 후 `Del` 키

**속도 조절:**
- `Edit` → `Override Delay` → `100ms` 입력 (부드러운 애니메이션)

**텍스트 추가 (선택):**
- `Image` → `Caption`
- 설명 텍스트 추가 (예: "비디오 업로드 중...")

**화살표/하이라이트 추가 (선택):**
- `Image` → `Drawing`
- 중요한 버튼이나 요소에 화살표 추가

### 4. 저장 (최적화 필수!)

1. `File` → `Save As` → `GIF`

2. **인코더 설정:**
   ```
   Encoder: FFmpeg (최고 품질)
   Frame Rate: 10 fps (파일 크기↓, 품질 적절)
   Quality: Medium
   Colors: 256
   ```

3. **최적화 옵션 (중요!):**
   - ✅ `Detect unchanged pixels` (파일 크기 50% 감소!)
   - ✅ `Override delay` : 100ms
   - ✅ `Remove duplicate frames`

4. **파일 이름:**
   - `demo-upload-video.gif`
   - `demo-browse-videos.gif`
   - `demo-ai-title-generation.gif`

5. **저장 위치:**
   ```
   c:\project\our-tube-next\assets\demos\
   ```

---

## 📏 GIF 사양 가이드

### 권장 사양

- **해상도:** 1280x720 (16:9) 또는 1024x768 (4:3)
- **프레임 레이트:** 10-15 fps
- **길이:** 10-20초
- **파일 크기:** 최대 10MB (GitHub에 직접 업로드 가능)
- **컬러:** 256색 (GIF 표준)

### 파일 크기 줄이기 팁

1. **해상도 낮추기:** 1280x720 → 1024x576
2. **프레임 레이트 낮추기:** 30fps → 10fps
3. **색상 수 줄이기:** 256 → 128
4. **불필요한 프레임 삭제**
5. **Optimize 옵션 활성화**

---

## 🚀 녹화 후 작업

### 1. GIF 파일 추가

```bash
# 파일을 올바른 위치에 저장
assets/demos/
├── demo-upload-video.gif
├── demo-browse-videos.gif
└── demo-ai-title-generation.gif
```

### 2. Git에 추가

```bash
git add assets/demos/*.gif
git commit -m "Add demo GIFs for README"
git push
```

### 3. README에서 확인

GitHub에 푸시 후 README에서 GIF가 제대로 표시되는지 확인:
- https://github.com/Hyeonjeong-JANG/our-tube-next

---

## ⚠️ 주의사항

### 파일 크기

- GitHub는 10MB 이상 파일에 대해 경고
- 10MB 이상이면 Git LFS 사용 고려:

```bash
# Git LFS 설치 (한 번만)
git lfs install

# GIF 파일을 LFS로 추적
git lfs track "*.gif"
git add .gitattributes
git add assets/demos/*.gif
git commit -m "Add demo GIFs with Git LFS"
git push
```

### 개인정보

- 녹화 시 개인정보가 보이지 않도록 주의
- 이메일 주소, 실제 이름 등은 테스트 데이터 사용

### 품질 vs 크기

- 품질이 너무 낮으면 UI가 흐릿하게 보임
- 파일 크기가 너무 크면 로딩 느림
- **권장:** 2-5MB, Medium 품질

---

## 📚 추가 자료

- [ScreenToGif 공식 문서](https://github.com/NickeManarin/ScreenToGif/wiki)
- [GitHub 마크다운에서 GIF 사용하기](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images)
- [Git LFS 가이드](https://git-lfs.github.com/)

---

## ✅ 체크리스트

녹화 전:
- [ ] ScreenToGif 설치 완료
- [ ] 프로젝트 실행 (`npm run dev:all`)
- [ ] 테스트 비디오 파일 준비
- [ ] 브라우저 창 크기 조절 (1280x720)

녹화 중:
- [ ] 마우스 움직임 천천히
- [ ] 중요한 버튼 명확히 클릭
- [ ] 로딩/애니메이션 포함

편집 후:
- [ ] 불필요한 프레임 삭제
- [ ] 속도 조절 (100ms)
- [ ] 파일 크기 확인 (< 10MB)

업로드 후:
- [ ] README에서 GIF 표시 확인
- [ ] 모든 데모 GIF 동작 확인
- [ ] 파일 크기 최적화 완료

---

## 💡 문제 해결

**Q: GIF 파일이 너무 큽니다 (>10MB)**
```
A: 다음 방법 시도:
1. 프레임 레이트 낮추기 (10fps)
2. 해상도 낮추기 (1024x576)
3. 길이 줄이기 (15초 이하)
4. 색상 수 줄이기 (128색)
```

**Q: GIF가 GitHub에서 재생되지 않습니다**
```
A:
1. 파일 경로 확인 (대소문자 구분)
2. 파일이 실제로 업로드되었는지 확인
3. 브라우저 캐시 삭제 후 새로고침
```

**Q: GIF 품질이 너무 낮습니다**
```
A:
1. Quality: Medium → High
2. Frame Rate: 10fps → 15fps
3. Encoder: System → FFmpeg
```

---

행운을 빕니다! 🎬✨

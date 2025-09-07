# WebSocket Viewer

## 소개

이 프로젝트는 WebSocket 프로토콜의 핸드셰이크, 프레임 구조, 데이터 인코딩 과정을 시각적으로 탐색하고 실시간으로 실습할 수 있는 웹 애플리케이션입니다.  
프론트엔드는 Preact, TailwindCSS, DaisyUI, Vite로 구성되어 있으며, 백엔드는 Node.js(net tcp)로 WebSocket 서버와 REST API를 제공합니다.

- 데모: [https://wsview.petnyang.shop/demo](https://wsview.petnyang.shop/demo)

---

## 폴더 구조

```
backend/    # tcp 소켓인 net모듈 사용하여 http/ws 구현
frontend/   # Preact + Vite 기반 SPA 클라이언트
```

### 주요 파일

- `backend/app.js`  
  - TCP 레벨에서 직접 WebSocket 핸드셰이크 및 프레임 파싱/생성
  - 정적 파일 서빙 및 WebSocket 연결 관리

- `frontend/src/routers/`  
  - `demo.jsx` : 실시간 WebSocket 통신 데모 및 바이너리 프레임 분석
  - `describe.jsx` : WebSocket 프로토콜 개념 및 프레임 구조 설명

- `frontend/vite.config.js`  
  - 개발 중 백엔드 프록시 및 WebSocket 프록시 설정

---

## 실행 방법

1. **백엔드 실행**
   ```sh
   cd backend
   npm install
   npm run dev
   ```

2. **프론트엔드 실행**
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

3. 브라우저에서 [http://localhost:5000](http://localhost:5000) 접속

---

## 주요 기능

- WebSocket 핸드셰이크 과정 시각화 및 헤더 분석
- WebSocket 프레임 구조, 마스킹, 바이너리 데이터 실시간 분석
- Ping/Pong, 텍스트 메시지 등 다양한 프레임 시나리오 실습
- 실시간 채팅 및 원시 버퍼/파싱 결과 확인

---

## 참고

- 프론트엔드: [frontend/](frontend/)
- 백엔드: [backend/](backend/)
- 주요 데모: [/demo](frontend/src/routers/demo.jsx), [/describe](frontend/src/routers/describe.jsx)

---

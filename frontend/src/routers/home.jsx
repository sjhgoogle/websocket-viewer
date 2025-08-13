import { Header } from "./common/header";

export function Home() {
  return (
    <div class="bg-gray-50 min-h-screen">
      <Header />

      <div class="container mx-auto px-4 py-12">
        {/* <!-- 헤더 --> */}
        <div class="text-center mb-16">
          <h1 class="text-5xl font-bold text-gray-800 mb-4">
            WebSocket 프로토콜 탐색기
          </h1>
          <p class="text-lg text-gray-600">
            WebSocket 핸드셰이크, 패킷 교환, 데이터 인코딩의 인터랙티브 데모
          </p>
        </div>

        {/* <!-- 메인 카드들 --> */}
        <div class="grid md:grid-cols-2 gap-8 mb-16">
          {/* <!-- WebSocket Demo 카드 --> */}
          <div class="card bg-white shadow-xl">
            <div class="card-body text-center">
              <div class="flex justify-center mb-6">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    class="w-8 h-8 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
              </div>
              <h2 class="card-title text-2xl justify-center mb-4">
                WebSocket 데모
              </h2>
              <p class="text-gray-600 mb-6">
                실시간 WebSocket 핸드셰이크, ping/pong 교환, 원시 버퍼 데이터
                시각화를 확인하세요
              </p>
              <div class="card-actions justify-center">
                <a href="/demo" class="btn btn-primary btn-lg">
                  데모 시작
                </a>
              </div>
            </div>
          </div>

          {/* <!-- Protocol Analysis 카드 --> */}
          <div class="card bg-white shadow-xl">
            <div class="card-body text-center">
              <div class="flex justify-center mb-6">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    class="w-8 h-8 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h2 class="card-title text-2xl justify-center mb-4">
                프로토콜 분석
              </h2>
              <p class="text-gray-600 mb-6">
                WebSocket 프레임 구조, opcode, 바이너리 데이터 인코딩을
                이해하세요
              </p>
              <div class="card-actions justify-center">
                <button class="btn btn-success btn-lg">더 알아보기</button>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- What You'll Learn 섹션 --> */}
        <div class="card bg-white shadow-xl">
          <div class="card-body">
            <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
              학습 내용
            </h2>

            <div class="grid md:grid-cols-3 gap-8">
              {/* <!-- Handshake Process --> */}
              <div class="text-center">
                <div class="flex justify-center mb-4">
                  <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg
                      class="w-6 h-6 text-purple-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h3 class="text-xl font-semibold mb-2">핸드셰이크 과정</h3>
                <p class="text-gray-600">
                  HTTP에서 WebSocket 프로토콜로 업그레이드
                </p>
              </div>

              {/* <!-- Ping/Pong Frames --> */}
              <div class="text-center">
                <div class="flex justify-center mb-4">
                  <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg
                      class="w-6 h-6 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h3 class="text-xl font-semibold mb-2">Ping/Pong 프레임</h3>
                <p class="text-gray-600">연결 유지 메커니즘 시각화</p>
              </div>

              {/* <!-- Binary Data --> */}
              <div class="text-center">
                <div class="flex justify-center mb-4">
                  <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg
                      class="w-6 h-6 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h3 class="text-xl font-semibold mb-2">바이너리 데이터</h3>
                <p class="text-gray-600">원시 버퍼와 파싱된 문자열 표시</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

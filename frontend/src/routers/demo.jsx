import { Router, useRoute, useLocation } from "preact-iso";
import { Header } from "./common/header";
import { useSignalEffect, useSignal } from "@preact/signals";

import { useRef } from "preact/hooks";

export function Demo() {
  const count = useSignal(0);
  const wsUrl = useSignal("ws://localhost:3000");
  const isWsConnected = useSignal(false);

  const chatInput = useSignal("");

  function sendChat() {
    const msg = chatInput.value;
    wsSignal.value.send(msg);
    chatInput.value = "";
  }

  const chatArea = useRef(null);

  function inputHandler(e) {
    const inputV = e.currentTarget.value;
    chatInput.value = inputV;
  }

  const wsSignal = useSignal(null);
  const chatArr = useSignal([
    // {
    //   // content: "aa ping", // 실제 메시지 내용
    //   // rawData: "wefwefwe 89 84 79 6f 8e 67", // Raw 바이너리 데이터
    //   // frameType: "Ping Frame ", // 프레임 타입 설명
    //   // timestamp: "오후 5:59:50", // 시간
    //   time: "12:31:12",
    //   sender: "client", // 또는 "server"
    //   originMsg: "aa ping", // 원본 메시지
    //   eightArr: ["1234", "933939"],
    //   frameType: "large ",
    //   frameLength: "128",
    //   type: "ping", // 메시지 타입 (ping, pong, text 등)
    // },
    // {
    //   id: 2,
    //   // content: "pong",
    //   // rawData: "8a 84 7a 6f 8e 67",
    //   // timestamp: "오후 5:59:50",
    //   // frameType: "Pong Frame (0x8a)",
    //   originMsg: "222 aa ping", // 원본 메시지
    //   eightArr: [],
    //   frameType: "22large middle or small",
    //   frameLength: "  22128",
    //   sender: "server",
    //   type: "pong",
    // },
  ]);

  const wsKeySet = useSignal({});
  const clientHandshake = useSignal({
    headers: [],
  });
  const serverHandshake = useSignal({
    headers: [],
  });

  useSignalEffect(() => {
    console.log("isWsConnected", isWsConnected.value);
    // console.log("isWsConnected", clientHandshake.value.headers);
    // clientHandshake.value = {
    //   headers: ["!!!EFIE"],
    // };

    // console.log("isWsConnected", clientHandshake.value.headers);
    // connectWs();
  }, []);

  async function connectWs() {
    const ws = new WebSocket(wsUrl.value);

    wsSignal.value = ws;

    wsSignal.value.onopen = () => {
      console.log("ws connected");
      isWsConnected.value = true;

      // 페이로드 길이에따른 binary[1] 값
      // 작은페이로드 : 10000000 ~ 11111101 (0~125)
      // 중간페이로드 : 11111101 ~ 11111101 (126~65535) binary[1]에선 고정이고 binary[2,3] 에서 추가로기술됨
      // 대형페이로드 : 11111111 ~ 11111111 중간과 동일

      // const smallData = "ABCDE".repeat(100000).slice(0, 125); // 0~125
      // const middlebigData = "ABCDE".repeat(100000).slice(0, 126); // 126~65535
      // const bitbigData = "ABCDE".repeat(100000).slice(0, 65536); // 65536~4바이트 // 패킷이 2번에 나누어들어가짐, os마다 다를듯
      // wsSignal.value.send(
      //   JSON.stringify({
      //     a: 1,
      //     b: middlebigData,
      //   })
      // );
    };

    wsSignal.value.onmessage = (event) => {
      // const data = JSON.parse(event.data);

      let data = null;

      try {
        data = JSON.parse(event.data);
      } catch (error) {
        data = event.data;
      }

      console.log("🚀 ~ connectWs ~ data:", data);
      const type = data.type;
      const msg = data.msg;

      if (type === "ws-handshake") {
        console.log("🚀 ~ ws-handshake ~ msg:", msg);
        console.log("🚀 ~ ws-handshake ~ msg:", clientHandshake.value);

        clientHandshake.value = {
          headers: msg.clientWsHeaders,
        };

        serverHandshake.value = {
          headers: msg.serverWsHeaders,
        };

        const secWebSocketKey = msg.clientWsHeaders.find((header) =>
          header.includes("Sec-WebSocket-Key")
        );
        const key = secWebSocketKey.split(": ")[1];

        const secWebSocketAccept = msg.serverWsHeaders.find((header) =>
          header.includes("Sec-WebSocket-Accept")
        );
        const accept = secWebSocketAccept.split(": ")[1];

        wsKeySet.value = {
          key,
          accept,
        };
      } else if (type === "ws-message") {
        console.log("🚀 ~ connectWs ~ msg:", msg);
        console.log("🚀 ~ connectWs ~ msg:", msg);
        const { time, sender, originMsg, intArr, eightArr, analBuffer } = msg;

        chatArr.value = [
          ...chatArr.value,
          {
            time: time,
            originMsg: originMsg,
            eightArr: eightArr,

            // rawData: analBuffer,
            // frameType: sender === "client" ? "Client" : "Server",
            // timestamp: genTime(),
            frameType: msg.frameType,
            frameLength: msg.frameLength,

            sender: sender,
            type: "text",
          },
        ];

        requestAnimationFrame(() => {
          chatArea.current.scrollTop = chatArea.current.scrollHeight;
        });
      }
    };

    wsSignal.value.onclose = () => {};
  }

  async function disconnectWs() {
    wsSignal.value.close();
    isWsConnected.value = false;
  }

  return (
    <div class="bg-gray-50 min-h-screen">
      <Header />
      <div class="container mx-auto px-4 py-8">
        {/* Connection Controls */}
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <div
                  class={`w-3 h-3 rounded-full ${
                    isWsConnected.value ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span class="text-lg font-medium text-gray-700">
                  {isWsConnected.value ? "연결됨" : "연결 끊김"}
                </span>
              </div>
              <span class="text-lg text-gray-500">|</span>
              <span class="text-lg text-gray-600 font-mono">{wsUrl.value}</span>
            </div>
            <div class="flex space-x-3">
              {isWsConnected.value ? (
                <button onClick={disconnectWs} class="btn btn-error btn-sm">
                  연결 해제
                </button>
              ) : (
                <button onClick={connectWs} class="btn btn-primary btn-sm">
                  연결
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Chat Header */}
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <h2 class="text-4xl font-bold text-white">WebSocket 통신</h2>
              <div class="flex items-center space-x-4 text-white text-lg">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>실시간</span>
                </div>
                <span>|</span>
                <span>실시간 프로토콜 분석</span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div ref={chatArea} class="p-6 space-y-6 max-h-196 overflow-y-auto">
            {clientHandshake.value.headers.length > 0 && (
              <div class="flex justify-start">
                <div class="flex items-start space-x-3 max-w-lg">
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    C
                  </div>
                  <div class="bg-blue-100 rounded-2xl rounded-tl-md px-4 py-3">
                    <div class="text-xl font-medium text-blue-900 mb-1">
                      클라이언트
                    </div>
                    <div class="text-lg text-blue-800">
                      <div class="font-mono text-base bg-blue-200 rounded px-2 py-1 mb-2">
                        {clientHandshake.value.headers.map((header) => {
                          return (
                            <div class="text-base space-y-1">
                              <div>{header}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Server Response - Connection Established */}
            {serverHandshake.value.headers.length > 0 && (
              <div class="flex justify-end">
                <div class="flex items-start space-x-3 max-w-lg">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    S
                  </div>
                  <div class="bg-green-100 rounded-2xl rounded-tr-md px-4 py-3">
                    <div class="text-xl font-medium text-green-900 mb-1">
                      서버
                    </div>
                    <div class="text-lg text-green-800">
                      <div class="font-mono text-base bg-green-200 rounded px-2 py-1 mb-2">
                        {serverHandshake.value.headers.map((header) => {
                          return (
                            <div class="text-base space-y-1">
                              <div>{header}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div class="text-base space-y-1">
                        클라이언트가 전달한 키값({wsKeySet.value.key})을 <br />
                        서버가 해시처리({wsKeySet.value.accept}) 하여 다시 전달
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {chatArr.value.map((message) => {
              const isClient = message.sender === "client";

              return (
                <div
                  class={`flex ${isClient ? "justify-start" : "justify-end"}`}
                >
                  <div class={`flex items-start space-x-3 max-w-lg `}>
                    {/* 아바타 - 클라이언트는 왼쪽, 서버는 오른쪽 */}
                    <div
                      class={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                        isClient ? "bg-blue-500" : "bg-green-500"
                      }`}
                    >
                      {isClient ? "C" : "S"}
                    </div>

                    {/* 메시지 박스 */}
                    <div
                      class={`rounded-2xl px-4 py-3 ${
                        isClient
                          ? "bg-blue-100 text-blue-900 rounded-tl-md"
                          : "bg-green-100 text-green-900 rounded-tr-md"
                      }`}
                    >
                      {/* 헤더 */}
                      <div
                        class={`text-xl font-medium mb-1 ${
                          isClient ? "text-blue-900" : "text-green-900"
                        }`}
                      >
                        {isClient ? "클라이언트" : "서버"}
                      </div>

                      {/* 프레임 타입 */}
                      <div
                        class={`font-mono text-lg rounded px-2 py-1 mb-2 ${
                          isClient ? "bg-blue-200" : "bg-green-200"
                        }`}
                      >
                        {message.originMsg}
                      </div>

                      {/* Raw 데이터 */}
                      <div class="text-base">
                        <span class="text-gray-500">원시 데이터:</span>
                        <div class="bg-gray-900 text-green-400 p-2 rounded mt-1 font-mono">
                          {message.eightArr.map((eight) => {
                            return <div>{eight}</div>;
                          })}
                        </div>
                        {/* 페이로드 */}
                        <span class="text-gray-500">페이로드:</span>
                        타입: {message.frameType} 길이: {message.frameLength}
                      </div>

                      {/* 타임스탬프 */}
                      <div
                        class={`text-base mt-2 ${
                          isClient ? "text-blue-600" : "text-green-600"
                        }`}
                      >
                        {message.time}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Area */}
          <div class="border-t border-gray-200 p-4 bg-gray-50">
            <div class="flex space-x-3">
              <input
                type="text"
                placeholder="보낼 메시지를 입력하세요..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={chatInput.value}
                onInput={inputHandler}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendChat();
                  }
                }}
              />
              <button
                type="button"
                class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                onClick={sendChat}
              >
                전송 {chatArr.value.length}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div class="mt-8 text-center">
          <div class="flex items-center justify-center space-x-2 text-lg text-gray-500">
            <span>제작자</span>
            <span class="text-purple-500">sjh</span>
          </div>
        </div>
      </div>
    </div>
  );
}

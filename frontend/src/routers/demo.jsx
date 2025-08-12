import { Router, useRoute, useLocation } from "preact-iso";
import { Header } from "./common/header";
import { signal, useSignalEffect } from "@preact/signals";

export function Demo() {
  const count = signal(0);
  const wsUrl = signal("ws://localhost:3000");
  const isWsConnected = signal(false);

  function asdf() {
    count.value++;
  }

  async function connectWs() {
    const ws = new WebSocket(wsUrl.value);
    ws.onopen = () => {
      console.log("ws connected");
      isWsConnected.value = true;

      ws.send("abcde");
    };

    ws.onmessage = (event) => {
      console.log("ws message", event.data);
    };
  }

  async function disconnectWs() {}

  useSignalEffect(() => {
    console.log("isWsConnected", isWsConnected.value);
  }, [isWsConnected]);

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
                <span class="text-sm font-medium text-gray-700">
                  {isWsConnected.value ? "Connected" : "Disconnected"}
                </span>
              </div>
              <span class="text-sm text-gray-500">|</span>
              <span class="text-sm text-gray-600 font-mono">{wsUrl.value}</span>
            </div>
            <div class="flex space-x-3">
              {isWsConnected.value ? (
                <button onClick={disconnectWs} class="btn btn-error btn-sm">
                  Disconnect
                </button>
              ) : (
                <button onClick={connectWs} class="btn btn-primary btn-sm">
                  Connect
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
              <h2 class="text-xl font-bold text-white">
                WebSocket Communication
              </h2>
              <div class="flex items-center space-x-4 text-white text-sm">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
                <span>|</span>
                <span>Real-time Protocol Analysis</span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div class="p-6 space-y-6 max-h-96 overflow-y-auto">
            {/* Client Message - Connection Request */}
            <div class="flex justify-start">
              <div class="flex items-start space-x-3 max-w-lg">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  C
                </div>
                <div class="bg-blue-100 rounded-2xl rounded-tl-md px-4 py-3">
                  <div class="text-sm font-medium text-blue-900 mb-1">
                    Client
                  </div>
                  <div class="text-sm text-blue-800">
                    <div class="font-mono text-xs bg-blue-200 rounded px-2 py-1 mb-2">
                      GET / HTTP/1.1
                    </div>
                    <div class="text-xs space-y-1">
                      <div>Upgrade: websocket</div>
                      <div>Connection: Upgrade</div>
                      <div>Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==</div>
                    </div>
                  </div>
                  <div class="text-xs text-blue-600 mt-2">오후 5:59:49</div>
                </div>
              </div>
            </div>

            {/* Server Response - Connection Established */}
            <div class="flex justify-end">
              <div class="flex items-start space-x-3 max-w-lg">
                <div class="bg-green-100 rounded-2xl rounded-tr-md px-4 py-3">
                  <div class="text-sm font-medium text-green-900 mb-1">
                    Server
                  </div>
                  <div class="text-sm text-green-800">
                    <div class="font-mono text-xs bg-green-200 rounded px-2 py-1 mb-2">
                      HTTP/1.1 101 Switching Protocols
                    </div>
                    <div class="text-xs space-y-1">
                      <div>Upgrade: websocket</div>
                      <div>Connection: Upgrade</div>
                      <div>Sec-WebSocket-Accept: calculated-hash-value</div>
                    </div>
                  </div>
                  <div class="text-xs text-green-600 mt-2">오후 5:59:49</div>
                </div>
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  S
                </div>
              </div>
            </div>

            {/* Server Message - Welcome */}
            <div class="flex justify-end">
              <div class="flex items-start space-x-3 max-w-lg">
                <div class="bg-green-100 rounded-2xl rounded-tr-md px-4 py-3">
                  <div class="text-sm font-medium text-green-900 mb-1">
                    Server
                  </div>
                  <div class="text-sm text-green-800">
                    <div class="font-mono text-xs bg-green-200 rounded px-2 py-1 mb-2">
                      Text Frame (0x81)
                    </div>
                    <div class="text-xs">
                      <span class="text-gray-500">Raw:</span>
                      <div class="bg-gray-900 text-green-400 p-2 rounded mt-1 font-mono">
                        82 65 71 75 65 73 74 20 73 65 72 76 65 64 20 62 79 20 64
                        35 36 38 33 32 34 63 30 38 66
                      </div>
                      <span class="text-gray-500">Parsed:</span> Request served
                      by d568324c08fc
                    </div>
                  </div>
                  <div class="text-xs text-green-600 mt-2">오후 5:59:49</div>
                </div>
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  S
                </div>
              </div>
            </div>

            {/* Client Message - Ping */}
            <div class="flex justify-start">
              <div class="flex items-start space-x-3 max-w-lg">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  C
                </div>
                <div class="bg-blue-100 rounded-2xl rounded-tl-md px-4 py-3">
                  <div class="text-sm font-medium text-blue-900 mb-1">
                    Client
                  </div>
                  <div class="text-sm text-blue-800">
                    <div class="font-mono text-xs bg-blue-200 rounded px-2 py-1 mb-2">
                      Ping Frame (0x89)
                    </div>
                    <div class="text-xs">
                      <span class="text-gray-500">Raw:</span>
                      <div class="bg-gray-900 text-green-400 p-2 rounded mt-1 font-mono">
                        89 84 79 6f 8e 67
                      </div>
                      <span class="text-gray-500">Payload:</span> ping
                    </div>
                  </div>
                  <div class="text-xs text-blue-600 mt-2">오후 5:59:50</div>
                </div>
              </div>
            </div>

            {/* Server Response - Pong */}
            <div class="flex justify-end">
              <div class="flex items-start space-x-3 max-w-lg">
                <div class="bg-green-100 rounded-2xl rounded-tr-md px-4 py-3">
                  <div class="text-sm font-medium text-green-900 mb-1">
                    Server
                  </div>
                  <div class="text-sm text-green-800">
                    <div class="font-mono text-xs bg-green-200 rounded px-2 py-1 mb-2">
                      Pong Frame (0x8a)
                    </div>
                    <div class="text-xs">
                      <span class="text-gray-500">Raw:</span>
                      <div class="bg-gray-400 p-2 rounded mt-1 font-mono">
                        8a 84 7a 6f 8e 67
                      </div>
                      <span class="text-gray-500">Payload:</span> pong
                    </div>
                  </div>
                  <div class="text-xs text-green-600 mt-2">오후 5:59:50</div>
                </div>
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  S
                </div>
              </div>
            </div>

            {/* Client Message - Text */}
            <div class="flex justify-start">
              <div class="flex items-start space-x-3 max-w-lg">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  C
                </div>
                <div class="bg-blue-100 rounded-2xl rounded-tl-md px-4 py-3">
                  <div class="text-sm font-medium text-blue-900 mb-1">
                    Client
                  </div>
                  <div class="text-sm text-blue-800">
                    <div class="font-mono text-xs bg-blue-200 rounded px-2 py-1 mb-2">
                      Text Frame (0x81)
                    </div>
                    <div class="text-xs">
                      <span class="text-gray-500">Message:</span> Hello
                      WebSocket!
                    </div>
                  </div>
                  <div class="text-xs text-blue-600 mt-2">오후 5:59:51</div>
                </div>
              </div>
            </div>

            {/* Server Response - Echo */}
            <div class="flex justify-end">
              <div class="flex items-start space-x-3 max-w-lg">
                <div class="bg-green-100 rounded-2xl rounded-tr-md px-4 py-3">
                  <div class="text-sm font-medium text-green-900 mb-1">
                    Server
                  </div>
                  <div class="text-sm text-green-800">
                    <div class="font-mono text-xs bg-green-200 rounded px-2 py-1 mb-2">
                      Text Frame (0x81)
                    </div>
                    <div class="text-xs">
                      <span class="text-gray-500">Echo:</span> Hello WebSocket!
                    </div>
                  </div>
                  <div class="text-xs text-green-600 mt-2">오후 5:59:51</div>
                </div>
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  S
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div class="border-t border-gray-200 p-4 bg-gray-50">
            <div class="flex space-x-3">
              <input
                type="text"
                placeholder="Type a message to send..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Send
              </button>
              <button class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                Ping
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div class="mt-8 text-center">
          <div class="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span>Designed by</span>
            <span class="text-orange-500">🦊 Readdy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

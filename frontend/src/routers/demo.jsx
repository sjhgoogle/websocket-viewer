import { Router, useRoute, useLocation } from "preact-iso";
import { Header } from "./common/header";

export function Demo() {
  return (
    <div class="bg-gray-50 min-h-screen">
      <Header />
      <div class="container mx-auto px-4 py-8">
        <div class="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              WebSocket URL
            </label>
            <div class="flex space-x-2">
              <input
                type="text"
                value="wss://echo.websocket.org/"
                class="input input-bordered flex-1"
                readonly
              />
              <button class="btn btn-error">Disconnect</button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Message to Send
            </label>
            <div class="flex space-x-2">
              <input
                type="text"
                value="Hello WebSocket!"
                class="input input-bordered flex-1"
                placeholder="Enter message..."
              />
              <button class="btn btn-primary">Send</button>
            </div>
          </div>
        </div>

        <div class="flex space-x-4 mb-8">
          <button class="btn btn-secondary">Send Ping</button>
          <button class="btn btn-ghost">Clear Logs</button>
        </div>

        <div class="card bg-white shadow-sm">
          <div class="card-header px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold">Protocol Log</h2>
          </div>
          <div class="card-body p-6">
            <div class="space-y-6">
              <div class="border-l-4 border-blue-500 pl-4">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span class="font-medium text-gray-900">
                      Initiating WebSocket Connection
                    </span>
                  </div>
                  <span class="text-xs text-gray-500">오후 5:59:49</span>
                </div>
                <p class="text-sm text-gray-600 ml-4">
                  Connecting to: wss://echo.websocket.org/
                </p>
              </div>

              <div class="border-l-4 border-blue-500 pl-4">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span class="font-medium text-gray-900">
                      Client → Server: HTTP Upgrade Request
                    </span>
                  </div>
                  <span class="text-xs text-gray-500">오후 5:59:49</span>
                </div>
                <div class="ml-4 bg-gray-50 rounded p-3 text-sm font-mono text-gray-700">
                  <div class="text-xs text-gray-500 mb-1">Headers:</div>
                  <div>Upgrade: websocket</div>
                  <div>Connection: Upgrade</div>
                  <div>Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==</div>
                  <div>Sec-WebSocket-Version: 13</div>
                </div>
              </div>

              <div class="border-l-4 border-green-500 pl-4">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span class="font-medium text-gray-900">
                      Server → Client: HTTP 101 Switching Protocols
                    </span>
                  </div>
                  <span class="text-xs text-gray-500">오후 5:59:49</span>
                </div>
                <div class="ml-4 bg-gray-50 rounded p-3 text-sm font-mono text-gray-700">
                  <div class="text-xs text-gray-500 mb-1">Headers:</div>
                  <div>HTTP/1.1: 101 Switching Protocols</div>
                  <div>Upgrade: websocket</div>
                  <div>Connection: Upgrade</div>
                  <div>Sec-WebSocket-Accept: calculated-hash-value</div>
                </div>
              </div>

              <div class="border-l-4 border-green-500 pl-4">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span class="font-medium text-gray-900">
                      WebSocket Connection Established
                    </span>
                  </div>
                  <span class="text-xs text-gray-500">오후 5:59:49</span>
                </div>
                <p class="text-sm text-gray-600 ml-4">
                  Ready to exchange frames
                </p>
              </div>

              <div class="border-l-4 border-purple-500 pl-4">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span class="font-medium text-gray-900">
                      Server → Client: Text Frame
                    </span>
                  </div>
                  <span class="text-xs text-gray-500">오후 5:59:49</span>
                </div>
                <div class="ml-4 space-y-2">
                  <div class="bg-gray-900 rounded p-3">
                    <div class="text-xs text-gray-400 mb-2">
                      Raw Buffer (Hex):
                    </div>
                    <div class="text-xs font-mono text-green-400 break-all">
                      82 65 71 75 65 73 74 20 73 65 72 76 65 64 20 62 79 20 64
                      35 36 38 33 32 34 63 30 38 66
                    </div>
                  </div>
                  <div class="text-sm">
                    <span class="text-gray-500">Parsed String:</span>
                    <br />
                    <span class="text-blue-600">
                      Request served by d568324c08fc
                    </span>
                  </div>
                </div>
              </div>

              <div class="border-l-4 border-orange-500 pl-4">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span class="font-medium text-gray-900">
                      Client → Server: Ping Frame
                    </span>
                  </div>
                  <span class="text-xs text-gray-500">오후 5:59:50</span>
                </div>
                <div class="ml-4 space-y-2">
                  <div class="bg-gray-900 rounded p-3">
                    <div class="text-xs text-gray-400 mb-2">
                      Raw Buffer (Hex):
                    </div>
                    <div class="text-xs font-mono text-green-400 break-all">
                      89 84 79 6f 8e 67
                    </div>
                  </div>
                  <div class="text-sm">
                    <span class="text-gray-500">Parsed String:</span>
                    <br />
                    <span class="text-blue-600">ping</span>
                  </div>
                </div>
              </div>

              <div class="border-l-4 border-yellow-500 pl-4">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span class="font-medium text-gray-900">
                      Server → Client: Pong Frame
                    </span>
                  </div>
                  <span class="text-xs text-gray-500">오후 5:59:50</span>
                </div>
                <div class="ml-4 space-y-2">
                  <div class="bg-gray-900 rounded p-3">
                    <div class="text-xs text-gray-400 mb-2">
                      Raw Buffer (Hex):
                    </div>
                    <div class="text-xs font-mono text-green-400 break-all">
                      8a 84 7a 6f 8e 67
                    </div>
                  </div>
                  <div class="text-sm">
                    <span class="text-gray-500">Parsed String:</span>
                    <br />
                    <span class="text-blue-600">pong</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 text-right">
          <div class="flex items-center justify-end space-x-2 text-sm text-gray-500">
            <span>Designed by</span>
            <span class="text-orange-500">🦊 Readdy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

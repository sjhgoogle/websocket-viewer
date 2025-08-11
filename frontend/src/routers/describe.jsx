import { Router, useRoute, useLocation } from "preact-iso";
import { Header } from "./common/header";

export function Describe() {
  const uL = useLocation();

  return (
    <div class="bg-gray-50 min-h-screen">
      <Header />

      <div class="container mx-auto px-4 py-8 space-y-12">
        <section class="card bg-white shadow-sm">
          <div class="card-body">
            <h2 class="text-2xl font-bold mb-4">WebSocket Handshake Process</h2>
            <p class="text-gray-600 mb-8">
              The WebSocket handshake is an HTTP upgrade request that
              establishes the WebSocket connection.
            </p>

            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-lg font-semibold mb-4">1. Client Request</h3>
                <div class="bg-gray-900 rounded-lg p-4 text-sm font-mono">
                  <div class="text-green-400">GET /chat HTTP/1.1</div>
                  <div class="text-blue-400">Host: example.com</div>
                  <div class="text-yellow-400">Upgrade: websocket</div>
                  <div class="text-yellow-400">Connection: Upgrade</div>
                  <div class="text-purple-400">
                    Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
                  </div>
                  <div class="text-gray-400">Sec-WebSocket-Version: 13</div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-4">2. Server Response</h3>
                <div class="bg-gray-900 rounded-lg p-4 text-sm font-mono">
                  <div class="text-green-400">
                    HTTP/1.1 101 Switching Protocols
                  </div>
                  <div class="text-yellow-400">Upgrade: websocket</div>
                  <div class="text-yellow-400">Connection: Upgrade</div>
                  <div class="text-purple-400">
                    Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 bg-blue-50 rounded-lg p-6">
              <h4 class="font-semibold text-blue-800 mb-4">Key Points</h4>
              <ul class="space-y-2 text-sm text-blue-700">
                <li>• The client sends a base64-encoded random key</li>
                <li>
                  • Server responds with a calculated hash of the key + magic
                  string
                </li>
                <li>
                  • This prevents proxy caching and confirms WebSocket support
                </li>
                <li>
                  • After 101 response, both sides can send WebSocket frames
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section class="card bg-white shadow-sm">
          <div class="card-body">
            <h2 class="text-2xl font-bold mb-4">WebSocket Frame Structure</h2>
            <p class="text-gray-600 mb-8">
              All WebSocket communication uses a specific frame format for data
              exchange.
            </p>

            <div class="mb-8">
              <h3 class="text-lg font-semibold mb-4">Frame Format</h3>
              <div class="bg-white border rounded-lg p-6 overflow-x-auto">
                <div class="min-w-[800px]">
                  <div class="grid grid-cols-8 gap-0 mb-1 text-[10px] text-center text-gray-500">
                    <div class="p-1 h-[35px] border border-gray-400">0</div>
                    <div class="p-1 h-[35px] border border-gray-400">1</div>
                    <div class="p-1 h-[35px] border border-gray-400">2</div>
                    <div class="p-1 h-[35px] border border-gray-400">3</div>
                    <div class="p-1 h-[35px] border border-gray-400">4</div>
                    <div class="p-1 h-[35px] border border-gray-400">5</div>
                    <div class="p-1 h-[35px] border border-gray-400">6</div>
                    <div class="p-1 h-[35px] border border-gray-400">7</div>
                    <div class="p-1 h-[35px] border border-gray-400">8</div>
                    <div class="p-1 h-[35px] border border-gray-400">9</div>
                    <div class="p-1 h-[35px] border border-gray-400">10</div>
                    <div class="p-1 h-[35px] border border-gray-400">11</div>
                    <div class="p-1 h-[35px] border border-gray-400">12</div>
                    <div class="p-1 h-[35px] border border-gray-400">13</div>
                    <div class="p-1 h-[35px] border border-gray-400">14</div>
                    <div class="p-1 h-[35px] border border-gray-400">15</div>
                  </div>
                  <div class="grid grid-cols-8 gap-0 mb-2">
                    <div class="bg-red-200 border border-gray-400 text-center py-2 text-xs h-[35px] font-semibold">
                      FIN
                    </div>
                    <div class="bg-yellow-200 border-t border-b border-r border-gray-400 text-center py-2 text-xs h-[35px] font-semibold col-span-3">
                      RSV
                    </div>
                    <div class="bg-green-200 border-t border-b border-r border-gray-400 text-center py-2 text-xs h-[35px] font-semibold col-span-4">
                      Opcode
                    </div>
                    <div class="bg-blue-200 border-t border-b border-r border-gray-400 text-center py-2 text-xs h-[35px] font-semibold">
                      M
                    </div>
                    <div class="bg-purple-200 border-t border-b border-r border-gray-400 text-center py-2 text-xs h-[35px] font-semibold col-span-7">
                      Payload Length
                    </div>
                  </div>
                  class="border border-gray-400 bg-purple-100 text-center py-3
                  text-sm font-medium mb-2" -- Extended Payload Length (if
                  payload length = 126 or 127)
                  <div class="border border-gray-400 bg-blue-100 text-center py-3 text-sm font-medium mb-2">
                    Masking Key (if MASK = 1)
                  </div>
                  <div class="border border-gray-400 bg-gray-100 text-center py-6 text-sm font-medium mb-6">
                    Payload Data
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-6 text-sm">
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <div class="w-4 h-4 bg-red-200 border border-gray-400 mr-3"></div>
                      <span>
                        <strong>FIN (1 bit):</strong> Final fragment
                      </span>
                    </div>
                    <div class="flex items-center">
                      <div class="w-4 h-4 bg-yellow-200 border border-gray-400 mr-3"></div>
                      <span>
                        <strong>RSV (3 bits):</strong> Reserved
                      </span>
                    </div>
                    <div class="flex items-center">
                      <div class="w-4 h-4 bg-green-200 border border-gray-400 mr-3"></div>
                      <span>
                        <strong>Opcode (4 bits):</strong> Frame type
                      </span>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <div class="w-4 h-4 bg-blue-200 border border-gray-400 mr-3"></div>
                      <span>
                        <strong>MASK (1 bit):</strong> Masking flag
                      </span>
                    </div>
                    <div class="flex items-center">
                      <div class="w-4 h-4 bg-purple-200 border border-gray-400 mr-3"></div>
                      <span>
                        <strong>Length (7 bits):</strong> Payload size
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-lg font-semibold mb-4">Opcode Values</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between p-2 bg-gray-50 rounded">
                    <span class="font-mono">0x0</span>
                    <span>Continuation Frame</span>
                  </div>
                  <div class="flex justify-between p-2 bg-gray-50 rounded">
                    <span class="font-mono">0x1</span>
                    <span>Text Frame</span>
                  </div>
                  <div class="flex justify-between p-2 bg-gray-50 rounded">
                    <span class="font-mono">0x2</span>
                    <span>Binary Frame</span>
                  </div>
                  <div class="flex justify-between p-2 bg-gray-50 rounded">
                    <span class="font-mono">0x8</span>
                    <span>Connection Close</span>
                  </div>
                  <div class="flex justify-between p-2 bg-gray-50 rounded">
                    <span class="font-mono">0x9</span>
                    <span>Ping</span>
                  </div>
                  <div class="flex justify-between p-2 bg-gray-50 rounded">
                    <span class="font-mono">0xA</span>
                    <span>Pong</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-4">Sample Frames</h3>
                <div class="space-y-4">
                  <div class="bg-gray-900 rounded p-3">
                    <div class="text-xs text-gray-400 mb-1">
                      Raw: 81 04 70 69 6E 67
                    </div>
                    <div class="text-green-400 text-xs font-mono">
                      Final Ping Frame - "ping"
                    </div>
                  </div>
                  <div class="bg-gray-900 rounded p-3">
                    <div class="text-xs text-gray-400 mb-1">
                      Raw: 8A 04 70 6F 6E 67
                    </div>
                    <div class="text-green-400 text-xs font-mono">
                      Final Pong Frame - "pong"
                    </div>
                  </div>
                  <div class="bg-gray-900 rounded p-3">
                    <div class="text-xs text-gray-400 mb-1">
                      Raw: 81 05 37 74 21 30 7F 6F 4D 51 58
                    </div>
                    <div class="text-green-400 text-xs font-mono">
                      Final Text Frame - "Hello"
                    </div>
                  </div>
                  <div class="bg-gray-900 rounded p-3">
                    <div class="text-xs text-gray-400 mb-1">
                      Raw: 81 05 48 65 6C 6C 6F
                    </div>
                    <div class="text-green-400 text-xs font-mono">
                      Final Text Frame - "Hello"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="card bg-white shadow-sm">
          <div class="card-body">
            <h2 class="text-2xl font-bold mb-4">Data Encoding & Masking</h2>
            <p class="text-gray-600 mb-8">
              Client-to-server frames are masked for security, while
              server-to-client frames are unmasked.
            </p>

            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-lg font-semibold mb-4">Masking Process</h3>
                <div class="space-y-4 text-sm">
                  <div class="p-4 bg-gray-50 rounded">
                    <div class="font-semibold mb-2">
                      1. Generate 32-bit masking key
                    </div>
                    <div class="font-mono text-blue-600">37 FA 21 3D</div>
                  </div>
                  <div class="p-4 bg-gray-50 rounded">
                    <div class="font-semibold mb-2">2. Original payload</div>
                    <div class="font-mono text-green-600">
                      "Hello" -- 48 65 6C 6C 6F
                    </div>
                  </div>
                  <div class="p-4 bg-gray-50 rounded">
                    <div class="font-semibold mb-2">3. XOR with key</div>
                    <div class="font-mono text-purple-600">
                      48^37 65^FA 6C^21 6C^3D 6F^37
                    </div>
                  </div>
                  <div class="p-4 bg-gray-50 rounded">
                    <div class="font-semibold mb-2">4. Masked result</div>
                    <div class="font-mono text-red-600">7F 9F 4D 51 58</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-4">Complete Frame</h3>
                <div class="space-y-4">
                  <div class="p-4 bg-gray-50 rounded">
                    <div class="text-sm mb-2">
                      <span class="font-semibold">First byte:</span>
                      <span class="ml-2 font-mono">81 (FIN=1, Opcode=1)</span>
                    </div>
                    <div class="text-sm mb-2">
                      <span class="font-semibold">Second byte:</span>
                      <span class="ml-2 font-mono">85 (MASK=1, Length=5)</span>
                    </div>
                    <div class="text-sm mb-2">
                      <span class="font-semibold">Masking key:</span>
                      <span class="ml-2 font-mono">37 FA 21 3D</span>
                    </div>
                    <div class="text-sm">
                      <span class="font-semibold">Payload:</span>
                      <span class="ml-2 font-mono">7F 9F 4D 51 58</span>
                    </div>
                  </div>

                  <div class="bg-gray-900 rounded p-3">
                    <div class="text-xs text-gray-400 mb-1">
                      Complete frame:
                    </div>
                    <div class="text-green-400 text-xs font-mono break-all">
                      81 85 37 FA 21 3D 7F 9F 4D 51 58
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h4 class="font-semibold text-yellow-800 mb-2">Security Note</h4>
              <p class="text-sm text-yellow-700">
                Client frames are masked to prevent proxy cache poisoning
                attacks. The masking doesn't provide encryption - it's purely
                for security against certain network infrastructure
                vulnerabilities.
              </p>
            </div>
          </div>
        </section>

        <div class="text-right">
          <div class="flex items-center justify-end space-x-2 text-sm text-gray-500">
            <span>Designed by</span>
            <span class="text-orange-500">🦊 Readdy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

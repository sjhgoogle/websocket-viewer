const net = require("net");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

require("dotenv").config();

const PORT = 3000;

const HASHING_SALT = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

const server = net.createServer((socket) => {
  console.log("Client connected");

  socket.on("error", (err) => {
    console.log("Socket error:", err.message);
    // Don't crash the server, just log the error
  });

  socket.on("close", () => {
    console.log("Socket closed");
  });

  socket.once("data", (data) => {
    console.log("Received:");
    console.log(data.toString());
    const text = data.toString();

    const [headerPart, bodyPart] = text.split("\r\n\r\n");
    const headerParts = headerPart.split("\r\n");

    const requestLine = headerParts[0];
    const headerLine = headerParts.slice(1);

    const [method, _reqPath, version] = requestLine.split(" ");
    const reqPath = _reqPath === "/" ? "/index.html" : _reqPath;

    const headers = {};
    headerLine.forEach((line) => {
      const [key, value] = line.split(": ");
      headers[key] = value;
    });

    console.log("path:", reqPath);

    const body =
      headers["Content-Type"] === "application/json"
        ? JSON.parse(bodyPart)
        : bodyPart;

    const reqMap = {
      method,
      path: reqPath,
      version,
      headers,
      body: body,
    };

    // ######################## parse fin
    // ######################## parse fin
    // ######################## parse fin

    const isUpgrade = headers["Upgrade"] === "websocket";

    if (isUpgrade) {
      handleWebSocket(socket, reqMap);
      return;
    }

    //  response html
    //  response html
    //  response html
    //  response html

    const targetPath = path.join(__dirname, "../frontend/dist", reqPath);
    console.log("🚀 ~ targetPath:", targetPath);
    console.log("🚀 ~ targetPath:", fs.existsSync(targetPath));
    if (!fs.existsSync(targetPath)) {
      const response = [
        "HTTP/1.1 404 Not Found",
        "Content-Type: text/html",
        "",
        "",
      ].join("\r\n");
      socket.write(response);
      socket.end();
      return;
    }

    const resbody = fs.readFileSync(
      path.join(__dirname, "../frontend/dist", reqPath),
      "utf-8"
    );

    const reqExtension = path.extname(reqPath).toLowerCase();
    let contentType = "text/plain";
    if (reqExtension === ".html") {
      contentType = "text/html";
    } else if (reqExtension === ".css") {
      contentType = "text/css";
    } else if (reqExtension === ".js") {
      contentType = "application/javascript";
    }

    const response = [
      "HTTP/1.1 200 OK",
      `Content-Type: ${contentType}`,
      "",
      resbody,
    ].join("\r\n");
    socket.write(response);
    socket.end();
  });
  socket.on("close", () => {
    console.log("TCP client disconnected");
  });
});

function handleWebSocket(socket, reqMap) {
  const { headers } = reqMap;
  const key = headers["Sec-WebSocket-Key"];
  const hash = crypto
    .createHash("sha1")
    .update(key + HASHING_SALT)
    .digest("base64");

  const response = [
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${hash}`,
    "",
    "",
  ].join("\r\n");
  socket.write(response);

  // sendToClient(socket, "abcd !!");

  socket.on("data", (data) => {
    preetyBinary(data);

    if (checkFin(data)) {
      socket.end();
      return;
    }

    const decodedMsg = parseClientMessage(socket, data);
    console.log("🚀 ~ handleWebSocket ~ decodedMsg:", decodedMsg);

    sendToClient(socket, `대답봇: ${decodedMsg}`);
  });
}

function preetyBinary(binary) {
  const binaryDump = [...binary].map((byte) =>
    byte.toString(2).padStart(8, "0")
  );
  binaryDump.forEach((byte) => console.log(byte));
}

function checkFin(binary) {
  const firstByte = binary[0];
  const binaryString = firstByte.toString(2).padStart(8, "0");
  const last4Bits = binaryString.slice(4);
  console.log("🚀 ~ parseClientMessage ~ last4Bits:", last4Bits);

  if (last4Bits === "1000") {
    return true;
  } else {
    false;
  }
}
function parseClientMessage(socket, binary) {
  const secondBinary = binary[1];
  const binaryString2 = secondBinary.toString(2).padStart(8, "0");
  const isMask = binaryString2[0] === "1"; // 맨앞 1비트
  const payloadLength = parseInt(binaryString2.slice(1), 2); // 뒤 7비트

  console.log("🚀  isMask, payloadLength", isMask, payloadLength);
  // #############
  const maskList = [binary[2], binary[3], binary[4], binary[5]];
  const rawPayload = binary.slice(6);

  const decodedPayloadList = [];

  for (let i = 0; i < payloadLength; i++) {
    const maskIndex = i % 4;
    const decodedByte = rawPayload[i] ^ maskList[maskIndex]; // XOR 연산으로 실제값 디코딩
    decodedPayloadList.push(String.fromCharCode(decodedByte));
  }
  return decodedPayloadList.join("");
}

function sendToClient(socket, message) {
  // 송신메세지 길이표현 ex 00000101
  // const RES_PAYLOAD_LENGTH = message.length.toString(2).padStart(8, 0); // 2진수 변환
  // console.log("🚀 ~ sendToClient ~ RES_PAYLOAD_LENGTH:", RES_PAYLOAD_LENGTH);

  const payloadLength = Buffer.byteLength(message, "utf-8");
  const RES_PAYLOAD_LENGTH = payloadLength.toString(2).padStart(8, 0); // 2진수 변환
  console.log("🚀 ~ sendToClient ~ RES_PAYLOAD_LENGTH:", RES_PAYLOAD_LENGTH);

  const msgBuffer = Buffer.concat([
    // FIN(1), RSV1(0), RSV2(0), RSV3(0), OPCODE(0001)
    // 10000001 => 0x81
    Buffer.from([parseInt("10000001", 2)], "hex"), // 고정값
    // mask + payload_length 서버 -> 클라이언트 시 mask는 0이므로 payload 길이만 가지고 만든다.
    Buffer.from([parseInt(RES_PAYLOAD_LENGTH, 2)], "hex"),
    // 페이로드 메시지 인코딩(UTF-8)
    Buffer.from(message),
  ]);

  socket.write(msgBuffer);
}
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

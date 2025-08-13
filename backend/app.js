const net = require("net");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const e = require("express");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

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
    // console.log(data.toString());
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
      requestLine: requestLine,
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
  const { requestLine, headers } = reqMap;
  // console.log("🚀 ~ handleWebSocket ~ headers:", headers);
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
  ];
  socket.write(response.join("\r\n"));

  const clientWsHeaders = [
    requestLine,
    `Connection: ${headers["Connection"]}`,
    `Sec-WebSocket-Extensions: ${headers["Sec-WebSocket-Extensions"]}`,
    `Sec-WebSocket-Key: ${headers["Sec-WebSocket-Key"]}`,
    `Sec-WebSocket-Version: ${headers["Sec-WebSocket-Version"]}`,
  ];
  console.log("🚀 ~ handleWebSocket ~ clientWsHeaders:", clientWsHeaders);

  const serverWsHeaders = [...response];
  console.log("🚀 ~ handleWebSocket ~ serverWsHeaders:", serverWsHeaders);

  const msgBuffer = makeWsBuffer(
    JSON.stringify({
      type: "ws-handshake",
      msg: {
        clientWsHeaders,
        serverWsHeaders,
      },
    })
  );
  socket.write(msgBuffer);

  // const originMsg = "ABCD".repeat(1000);
  const originMsg = "helloee";
  const madeBuffer = makeWsBuffer(originMsg);

  // const msgBuffer2 = makeWsBuffer(
  //   JSON.stringify({
  //     type: "ws-message",

  //     msg: {
  //       time: genTime(),
  //       sender: "server",
  //       originMsg: originMsg,
  //       intArr: Array.from(madeBuffer),
  //       eightArr: Array.from(madeBuffer).map((byte) =>
  //         byte.toString(2).padStart(8, "0")
  //       ),
  //       frameType: getFrameType(originMsg).frameType,
  //       frameLength: getFrameType(originMsg).frameLength,

  //       analBuffer: analServerBuffer(madeBuffer),
  //     },
  //   })
  // );

  // socket.write(msgBuffer2);

  function analClientBuffer(originBuffer) {
    const res1 = Array.from(originBuffer);

    console.log("🚀 ~ clientBufferAnal ~ originBuffer:", originBuffer);
    // const firstByte = originBuffer[0];
    const secondByte = originBuffer[1];

    const secondByteStr = secondByte.toString(2).padStart(8, "0");

    const isMiddleSizeWs = secondByteStr === "11111110";

    const maskStartIndex = isMiddleSizeWs ? 4 : 2;
    const payloadStartIndex = maskStartIndex + 4;

    const res2 = res1.map((intByte) => {
      return {
        intType: intByte,
        hexType: intByte.toString(16).padStart(2, "0"),
        eightType: intByte.toString(2).padStart(8, "0"),
      };
    });
    console.log("🚀 ~ clientBufferAnal ~ res1:", res1);

    const resultMap = [];

    for (let i = 0; i < res2.length; i++) {
      // const byte = res2[i];
      const _innerMap = res2[i];

      let rowType = "";
      let targetMask = "";
      let targetAskii = "";

      if (i === 0) {
        rowType = "1번쨰줄 그거";
      } else if (i === 1) {
        rowType = "2번쨰줄 그거";
      } else if (isMiddleSizeWs && (i === 2 || i === 3)) {
        rowType = "미들사이즈라 길이 데이터";
      } else if (maskStartIndex <= i && i < payloadStartIndex) {
        rowType = "MASK 마스킹";
      } else {
        // 데이터겟죠..?
        rowType = "데이터 타입";
      }

      const innerMap = {
        ..._innerMap,
        // intType: byte,
        // hexType: byte.toString(16).padStart(2, "0"),
        // eightType: byte.toString(2).padStart(8, "0"),
        rowType: rowType,
      };
    }

    return resultMap;
  }

  function analServerBuffer(originBuffer) {
    const res1 = Array.from(originBuffer);

    // const firstByte = originBuffer[0];
    const secondByte = originBuffer[1];

    const secondByteStr = secondByte.toString(2).padStart(8, "0");

    const isMiddleSizeWs = secondByteStr === "01111110";

    const payloadStartIndex = isMiddleSizeWs ? 4 : 2;

    const res2 = res1.map((intByte) => {
      return {
        intType: intByte,
        hexType: intByte.toString(16).padStart(2, "0"),
        eightType: intByte.toString(2).padStart(8, "0"),
      };
    });
    console.log("🚀 ~ clientBufferAnal ~ res1:", res1);

    const resultMap = [];
    for (let i = 0; i < res2.length; i++) {
      const _innerMap = res2[i];

      let rowType = "";
      let targetAskii = "";
      if (i === 0) {
        rowType = "1번쨰줄 그거";
      } else if (i === 1) {
        rowType = "2번쨰줄 그거";
      } else if (i < payloadStartIndex) {
        rowType = "데이터가 길어서 미들";
      } else if (i >= payloadStartIndex) {
        rowType = "PAYLOAD";
        targetAskii = String.fromCharCode(_innerMap.intType);
      }

      const innerMap = {
        ..._innerMap,
        rowType: rowType,
        targetAskii: targetAskii,
      };

      resultMap.push(innerMap);
    }

    return resultMap;
  }

  socket.on("data", (data) => {
    preetyBinary(data);

    if (checkFin(data)) {
      socket.end();
      return;
    }

    const decodedMsg = parseClientMessage(socket, data);
    console.log("🚀 ~ handleWebSocket ~ decodedMsg:", decodedMsg.slice(0, 20));

    // const { msg } = clinetData;
    console.log("🚀 ~ handleWebSocket ~ msg:", data);

    // #### 클라데이터분석
    // const msgBuffer1_1 = makeWsBuffer(data);
    // console.log("🚀 ~ handleWebSocket ~ qwerqwer:", msgBuffer1_1);

    const msgBuffer1_2 = makeWsBuffer(
      JSON.stringify({
        type: "ws-message",

        msg: {
          time: genTime(),
          sender: "client",
          originMsg: decodedMsg,
          intArr: Array.from(data),
          eightArr: Array.from(data).map((byte) =>
            byte.toString(2).padStart(8, "0")
          ),
          frameType: getFrameType(decodedMsg).frameType,
          frameLength: getFrameType(decodedMsg).frameLength,

          analBuffer: analClientBuffer(data),
        },
      })
    );

    socket.write(msgBuffer1_2);

    // ### 클라데이터 분석 끝

    // ### 서버 퐁 시작

    const serverOriginMsg = `im bot : ${decodedMsg}`;

    const madeServerBuffer = makeWsBuffer(serverOriginMsg);

    const madeServerBuffer2 = makeWsBuffer(
      JSON.stringify({
        type: "ws-message",

        msg: {
          time: genTime(),
          sender: "server",
          originMsg: serverOriginMsg,
          intArr: Array.from(madeServerBuffer),
          eightArr: Array.from(madeServerBuffer).map((byte) =>
            byte.toString(2).padStart(8, "0")
          ),
          frameType: getFrameType(serverOriginMsg).frameType,
          frameLength: getFrameType(serverOriginMsg).frameLength,

          analBuffer: analServerBuffer(madeServerBuffer),
        },
      })
    );

    socket.write(madeServerBuffer2);
    // ### 서버 퐁 끗
  });
}

function preetyBinary(binary) {
  const binaryDump = [...binary]
    .map((byte) => byte.toString(2).padStart(8, "0"))
    .slice(0, 20);

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

function genTime() {
  // return 12:31:35
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const time = `${hours}:${minutes}:${seconds}`;
  return time;
}

function parseClientMessage(socket, binary) {
  const secondBinary = binary[1];
  const secondByteStr = secondBinary.toString(2).padStart(8, "0"); // ex 1000 1010
  console.log("🚀 ~ parseClientMessage ~ secondByteStr:", secondByteStr);

  const isMask = secondByteStr[0] === "1"; // 맨앞 1비트

  // const payloadLength = parseInt(binaryString.slice(1), 2); // 뒤 7비트

  const payloadLengthBits = secondByteStr.slice(1);

  let payloadLength;
  let maskStartIndex;
  let payloadStartIndex;

  if (secondByteStr === "11111111") {
    throw new Error("Payload too large, not supported");
  } else if (secondByteStr === "11111110") {
    // 126~65535
    // const payloadLength = parseInt(payloadLengthBits, 2);
    // return payloadLength;

    const byteUpper = binary[2].toString(2).padStart(8, "0");
    const byteLower = binary[3].toString(2).padStart(8, "0");
    payloadLength = parseInt(byteUpper + byteLower, 2);
    maskStartIndex = 4; // [4], [5], [6], [7]  마스크
    payloadStartIndex = 8; // [8] 부터 페이로드
  } else {
    // 작은 크기 0~125
    payloadLength = parseInt(payloadLengthBits, 2);
    maskStartIndex = 2; // [2], [3], [4], [5]  마스크
    payloadStartIndex = 6; // [6] 부터 페이로드
  }

  console.log("🚀 ~ parseClientMessage ~ payloadLength:", payloadLength);

  const maskList = [
    binary[maskStartIndex],
    binary[maskStartIndex + 1],
    binary[maskStartIndex + 2],
    binary[maskStartIndex + 3],
  ];
  const rawPayload = binary.slice(
    payloadStartIndex,
    payloadStartIndex + payloadLength
  );

  const decodedChars = [];

  for (let i = 0; i < payloadLength; i++) {
    const maskIndex = i % 4;
    const decodedByte = rawPayload[i] ^ maskList[maskIndex]; // XOR 연산으로 실제값 디코딩
    decodedChars.push(String.fromCharCode(decodedByte));
  }

  const resStr = decodedChars.join("");
  return resStr;

  // console.log("🚀  isMask, payloadLength", isMask, payloadLength);

  // 항상 16비트 페이로드 길이 스펙 사용 (126 플래그)
  // let maskStartIndex = 4; // 2-3번째 바이트가 16비트 페이로드 길이
  // let payloadStartIndex = 8; // 마스크 다음부터 페이로드 시작
  // let actualPayloadLength = (binary[2] << 8) | binary[3]; // 16비트 페이로드 길이

  // console.log("🚀  16-bit payload length:", actualPayloadLength);

  // // #############
  // const maskList = [
  //   binary[maskStartIndex],
  //   binary[maskStartIndex + 1],
  //   binary[maskStartIndex + 2],
  //   binary[maskStartIndex + 3],
  // ];
  // const rawPayload = binary.slice(payloadStartIndex);

  // const decodedPayloadList = [];

  // for (let i = 0; i < actualPayloadLength; i++) {
  //   const maskIndex = i % 4;
  //   const decodedByte = rawPayload[i] ^ maskList[maskIndex]; // XOR 연산으로 실제값 디코딩
  //   decodedPayloadList.push(String.fromCharCode(decodedByte));
  // }
  // return decodedPayloadList.join("");
}

function getFrameType(message) {
  const payloadLength = Buffer.byteLength(message, "utf-8");
  let frameType;
  if (payloadLength < 126) {
    frameType = "small";
  } else if (payloadLength < 65535) {
    frameType = "middle";
  } else {
    frameType = "large";
  }
  return {
    frameType,
    frameLength: payloadLength,
  };
}

function makeWsBuffer(message) {
  // const message = `{"clientWsHeaders":["GET / HTTP/1.1","Connection: Upgrade","Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits","Sec-WebSocket-Key: kVKbjCMAKMDqT9+VGnCrfw==","Sec-WebSocket-Version: 13"],"serverWsHeaders":["HTTP/1.1 101 Switching Protocols","Upgrade: websocket","Connection: Upgrade","Sec-WebSocket-Accept: E3XGmPCznQ+H8/SDjeUyY68hJX4=","",""]}`;

  const payloadLength = Buffer.byteLength(message, "utf-8");
  console.log("🚀 ~ sendToClient ~ payloadLength:", payloadLength);

  if (payloadLength < 126) {
    const msgBuffer = Buffer.concat([
      Buffer.from([parseInt("10000001", 2)]), // 고정값
      Buffer.from(
        [parseInt(payloadLength.toString(2).padStart(8, 0), 2)],
        "hex"
      ),
      Buffer.from(message),
    ]);

    return msgBuffer;
  } else if (payloadLength < 65535) {
    // 126~65535
    const payloadLenBuf = Buffer.alloc(2);
    payloadLenBuf.writeUInt16BE(payloadLength);

    // Buffer.from([parseInt(RES_PAYLOAD_LENGTH, 2)], "hex"),
    const msgBuffer = Buffer.concat([
      Buffer.from([parseInt("10000001", 2)]), // 고정값
      Buffer.from([parseInt("01111110", 2)]),
      payloadLenBuf,
      // 페이로드 메시지 인코딩(UTF-8)
      Buffer.from(message),
    ]);

    // socket.write(msgBuffer);
    return msgBuffer;
  } else {
    // 64비트(8바이트) 길이 필드 처리
    const payloadLenBuf = Buffer.alloc(8);
    // 상위 4바이트는 0으로 세팅 (JS는 2^53 -1까지만 안전)
    payloadLenBuf.writeUInt32BE(0, 0);
    payloadLenBuf.writeUInt32BE(payloadLength, 4);

    const msgBuffer = Buffer.concat([
      Buffer.from([parseInt("10000001", 2)]), // FIN+TEXT
      Buffer.from([parseInt("01111111", 2)]), // 127 (8바이트 길이 표시)
      payloadLenBuf,
      Buffer.from(message),
    ]);
    return msgBuffer;
  }
}

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

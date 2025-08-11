const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const ws = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  console.log("Requested full URL:", fullUrl);
  next();
});

// // API 예시
app.get("/api/ping", (req, res) => {
  console.log(99, req);
  res.json({ message: "Hello from Express!" });
});

app.get("/api/{*splat}", async (req, res) => {
  res.status(500).json({
    url: req.originalUrl,
  });
});

// Svelte 정적 파일 서빙
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// SPA 라우팅 처리 (404 방지)
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 3000;

// Create HTTP server and attach Express app
const server = http.createServer(app);

// Create WebSocket server
const wss = new ws.Server({ server });

let lastServerHeaders = [];

wss.on("headers", (headers, request) => {
  // Save server handshake response headers for this upgrade request
  lastServerHeaders = headers;
});

wss.on("connection", (socket, request) => {
  console.log("WebSocket client connected");
  const headers = request.headers;

  const clientHeaders = request.headers;

  // Extract only standard WS handshake headers from client
  const clientHeaderMap = {
    host: clientHeaders.host,
    upgrade: clientHeaders.upgrade,
    connection: clientHeaders.connection,
    secWebSocketKey: clientHeaders["sec-websocket-key"],
    secWebSocketVersion: clientHeaders["sec-websocket-version"],
    origin: clientHeaders.origin,
    secWebSocketProtocol: clientHeaders["sec-websocket-protocol"],
    secWebSocketExtensions: clientHeaders["sec-websocket-extensions"],
  };

  // Extract only WS headers from server handshake response headers
  const serverHeaderMap = {};

  lastServerHeaders.forEach((headerLine) => {
    const [key, ...rest] = headerLine.split(":");
    const k = key.trim().toLowerCase();
    const v = rest.join(":").trim();

    if (
      k === "upgrade" ||
      k === "connection" ||
      k === "sec-websocket-accept" ||
      k === "sec-websocket-protocol" ||
      k === "sec-websocket-extensions"
    ) {
      serverHeaderMap[key.trim()] = v;
    }
  });

  // Send both maps to client as JSON string
  socket.send(
    JSON.stringify({
      clientHeaders: clientHeaderMap,
      serverHeaders: serverHeaderMap,
    })
  );

  socket.on("message", (message, isBinary) => {
    console.log("Received:", isBinary);
    console.log("Received:", message);
    console.log("Received:", message.toString());
    // Echo message back to client
    // socket.send(`Echo: ${message}`);
  });

  socket.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

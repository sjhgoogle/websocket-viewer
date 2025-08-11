const net = require("net");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const PORT = 3000;

const server = net.createServer((socket) => {
  console.log("Client connected");
  socket.on("error", (err) => {
    console.log("Socket error:", err.message);
    // Don't crash the server, just log the error
  });
  socket.on("close", () => {
    console.log("Socket closed");
  });

  socket.on("data", (data) => {
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

    console.log("headers:", headers);
    console.log("method:", method);
    console.log("path:", reqPath);
    console.log("version:", version);

    let body = bodyPart;
    if (headers["Content-Type"] === "application/json") {
      const body = JSON.parse(body);
      console.log("json:", json);
    }

    console.log("body:", body);

    // ######################## parse fin
    // ######################## parse fin
    // ######################## parse fin

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

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), tailwindcss()],

  server: {
    port: 5000,
    proxy: {
      "/api": "http://localhost:3000", // 백엔드 API 프록시
    },
  },
});

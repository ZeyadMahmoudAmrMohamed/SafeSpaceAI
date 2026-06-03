import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000', // fastAPI
          changeOrigin: true,
          secure: false, // Crucial: This ignores self-signed SSL certificate issues locally
        },
      },
    },
  },
});
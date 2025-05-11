
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    cors: true,  // Enable CORS for all origins
    proxy: {
      // Add proxy for MCP requests if needed
      '/api/mcp': {
        target: 'https://blokth.com:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mcp/, '')
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

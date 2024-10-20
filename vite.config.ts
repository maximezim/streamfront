import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      '/videos': {
        target: 'http://streaming-api.remicaulier.fr',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  optimizeDeps: {
    include: ["react-toastify"],
  },
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core - chunk separado
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Bootstrap y UI - chunk separado
          'ui-vendor': ['bootstrap', 'react-bootstrap', 'react-icons'],

          // Librerías de reportes (pesadas) - chunk separado
          'reports-vendor': ['jspdf', 'jspdf-autotable', 'xlsx'],

          // Utilidades
          'utils-vendor': ['axios', 'jwt-decode', 'react-toastify'],
        },
      },
    },
    // Aumentar el límite de advertencia de chunk
    chunkSizeWarningLimit: 1000,
    // Minificar con esbuild (predeterminado y más rápido)
    minify: 'esbuild',
    target: 'esnext',
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// vite.config.js
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
  },
  // Enable HTML environment variable interpolation
  template: {
    transformIndexHtml: (html) => {
      return html.replace(/%(.+?)%/g, (match, p1) => {
        return import.meta.env[p1] || match;
      });
    },
  },
});

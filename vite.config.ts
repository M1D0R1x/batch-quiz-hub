import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
      serverFns: {
        disableCsrfMiddlewareWarning: true,
      },
    }),
    react(),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": "/Users/veera/batch-quiz-hub/src",
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
});

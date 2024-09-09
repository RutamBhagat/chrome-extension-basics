import { defineConfig } from "vite";
import { glob } from "glob";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        ...Object.fromEntries(
          glob.sync("src/utils/scripts/*.js").map((file) => [
            // This remove `src/utils/scripts` prefix and `.js` suffix
            file.slice(18, -3),
            // This complete path is needed for Rollup
            resolve(__dirname, file),
          ])
        ),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === "main"
            ? "assets/[name]-[hash].js"
            : "[name].js";
        },
      },
    },
  },
});

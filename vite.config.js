import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // setting src as an alias to '@'
      },
    },
    define: {
      "process.env": {},
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      lib: {
        entry: {
          investly: "./src/main.tsx",
        },
        formats: ["es"],
      },
    },
  });
};

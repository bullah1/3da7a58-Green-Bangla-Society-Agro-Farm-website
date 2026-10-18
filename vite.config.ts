import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-query", "@tanstack/query-core"],
  },
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    // src/server.ts wraps the SSR handler with a friendly error page.
    tanstackStart({ server: { entry: "server" } }),
    nitro(),
    viteReact(),
  ],
});

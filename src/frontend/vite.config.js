import { fileURLToPath, URL } from "url";
import { defineConfig, loadEnv } from "vite";
import environment from "vite-plugin-environment";
import path from "node:path";
import react from "@vitejs/plugin-react";

/** @type {import('vite').UserConfig} */
export default ({ mode }) => {
  const rootPath = path.resolve(__dirname, "../../");
  process.env = {
    ...process.env,
    ...loadEnv(mode, rootPath, "CANISTER_ID_"),
    ...loadEnv(mode, rootPath, "DFX_"),
  };

  return defineConfig({
    build: {
      emptyOutDir: true,
      chunkSizeWarningLimit: 1600,
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://0.0.0.0:4943", // Proxy to a local canister
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react({
        babel: {
          plugins: [['styled-components', { displayName: true }]]
        },
      }),
      environment("all", { prefix: "CANISTER_ID_", defineOn: "import.meta.env" }),
      environment("all", { prefix: "DFX_", defineOn: "import.meta.env"}),
    ],
    resolve: {
      alias: [
        {
          find: "declarations",
          replacement: fileURLToPath(
            new URL("../declarations", import.meta.url)
          ),
        },
      ],
    },
    define: {
      "process.env": "{}", // This is to avoid the error 'process is not defined
      global: "globalThis",
      // https://github.com/styled-components/babel-plugin-styled-components/issues/350#issuecomment-1909463492
      'SC_DISABLE_SPEEDY': "true", // needed to enable vendor prefixing using 'vite build'
    },
  });
};

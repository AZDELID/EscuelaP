import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "./", // NECESARIO PARA GITHUB PAGES (ruta relativa)
  plugins: [react()],

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: "docs", // GitHub Pages usa docs/
    assetsDir: "assets",
    sourcemap: false,
    minify: "terser",

    rollupOptions: {
      output: {
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: assetInfo => {
          const info = assetInfo.name || "";

          if (/\.css$/.test(info)) return "assets/css/[name]-[hash][extname]";
          if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(info))
            return "assets/images/[name]-[hash][extname]";
          if (/\.(woff2?|eot|ttf|otf)$/i.test(info))
            return "assets/fonts/[name]-[hash][extname]";

          return "assets/[name]-[hash][extname]";
        }
      }
    },

    cssCodeSplit: true,
    cssMinify: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },

  server: {
    port: 3000,
    open: true,
  },

  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  }
});

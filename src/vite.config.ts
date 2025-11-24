import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Rutas relativas para GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        // Organizar chunks en subcarpetas
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Organizar assets por tipo
          const info = assetInfo.name || '';
          
          // CSS en assets/css/
          if (/\.css$/.test(info)) {
            return 'assets/css/[name]-[hash][extname]';
          }
          
          // Imágenes en assets/images/
          if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(info)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          
          // Fuentes en assets/fonts/
          if (/\.(woff2?|eot|ttf|otf)$/i.test(info)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          
          // Otros assets
          return 'assets/[name]-[hash][extname]';
        },
        manualChunks: (id) => {
          // Separar vendor chunks para mejor caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            return 'vendor';
          }
        }
      }
    },
    // Optimizaciones
    cssCodeSplit: true,
    cssMinify: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096 // Inline assets < 4kb como base64
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  },
  // Asegurar compatibilidad
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});

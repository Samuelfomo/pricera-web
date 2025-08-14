// import { fileURLToPath, URL } from 'node:url'
// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
//
// import { dirname, resolve } from 'path';
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
//
// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url)),
//       '@public': fileURLToPath(new URL('./public', import.meta.url))
//     }
//   },
//   server: {
//     fs: {
//       allow: [
//         resolve(__dirname, 'src'),
//         resolve(__dirname, 'public')
//       ]
//     },
//     open: true,
//     host: true,
//     port: 5173
//   },
//   // Ajoutez cette section pour la production
//   build: {
//     rollupOptions: {
//       output: {
//         manualChunks(guid) {
//           if (guid.includes('node_modules')) {
//             return 'vendor';
//           }
//         }
//       }
//     }
//   }
// })
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [vue()],
  // Retiré root: 'src/frontend' car votre index.html est à la racine
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@public': fileURLToPath(new URL('./public', import.meta.url))
    }
  },
  server: {
    fs: {
      allow: [
        resolve(__dirname, 'src'),
        resolve(__dirname, 'public')
      ]
    },
    open: true,
    host: true,
    port: 5174,
    // Proxy pour le backend en développement
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Port de votre backend
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist/frontend', // Chemin depuis la racine du projet
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})



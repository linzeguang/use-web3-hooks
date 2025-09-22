import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/examples'],
      outDir: 'dist',
      staticImport: true,
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'useWeb3Hooks',
      fileName: (format) => {
        console.log('>>>>>> format: ', format)
        return `index.${format}.js`
      },
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        // 优化 chunk 分割
        manualChunks: undefined,
        inlineDynamicImports: true
        // // 减少文件数量
        // chunkFileNames: 'chunks/[name]-[hash].js',
        // entryFileNames: '[name].js',
        // assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
})

import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'], // 输出 ESM + CJS 两种格式
  dts: true, // 生成类型声明文件
  clean: true // 每次打包前清理 dist
})

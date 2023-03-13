/*
 * @Description: vite打包配置
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-23 09:49:37
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-05-28 19:27:24
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"./",
  build: {
    minify:'terser',
    // 取消计算文件大小，加快打包速度
    reportCompressedSize: false,
    // assetsDir: 'static/img',
    rollupOptions: {
        output: {
            chunkFileNames: 'js/[name]-[hash].js',
            entryFileNames: 'js/[name]-[hash].js',
            assetFileNames: '[ext]/[name]-[hash].[ext]',
        },
    },
  },
  // 移除less import前面的~
  resolve: {
    alias: [
      { find: /^~/, replacement: '' }
    ],
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        modifyVars: {
           'primary-color': '#08979c',
           'border-radius-base': '2px',
           'text-color':'#fafafa',
           'component-background':'#282c34',
           'heading-color':'#fff',
           'text-color-secondary':'#f0f0f0',
           'btn-default-ghost-color':'#fafafa',
           'descriptions-extra-color':'#edebfc',
           'badge-text-color':'#fff'
        },
        javascriptEnabled: true,
      },
    },
  },
  server:{
      open:true
  }
})

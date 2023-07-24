import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import react from '@vitejs/plugin-react';
dotenv.config({
  path: process.env.MY_APP_CONFIG_FILE_PATH,
});

let server = undefined;

if (process.env.VITE_ENVIRONMENT_TYPE === 'dev') {
  server = {
    proxy: {
      '/auth': {
        target: 'http://localhost:4001',
      },
      '/role': {
        target: 'http://localhost:4001',
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server,
  preview: server,
});

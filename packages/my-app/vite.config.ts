import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import react from '@vitejs/plugin-react';

dotenv.config({
  path: process.env.MY_APP_CONFIG_FILE_PATH,
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});

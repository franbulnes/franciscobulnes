import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import progressiveImages from './scripts/progressive-images.mjs';

export default defineConfig({
  plugins: [progressiveImages(), react()],
  base: '/',
});

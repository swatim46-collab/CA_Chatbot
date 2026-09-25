import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/CA_Chatbot/',
  plugins: [react()],
  server: {
    proxy: {
      '/__gemini': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(
          /^\/__gemini/,
          '/v1beta/models/gemma-4-26b-a4b-it:generateContent',
        ),
      },
    },
  },
});

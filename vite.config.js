import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        team: resolve(__dirname, 'team.html'),
        solutions: resolve(__dirname, 'solutions.html'),
        'solution-rakuplatform': resolve(__dirname, 'solution/rakuplatform.html'),
        'solution-salesforce': resolve(__dirname, 'solution/salesforce.html'),
        'solution-ai': resolve(__dirname, 'solution/ai.html'),
        'solution-nocobase': resolve(__dirname, 'solution/nocobase.html'),
        'solution-others': resolve(__dirname, 'solution/others.html'),
        blog: resolve(__dirname, 'blog.html'),
        'blog-nocobase-case-study': resolve(__dirname, 'blog/nocobase-case-study.html'),
        'blog-kaigo-rpa-automation': resolve(__dirname, 'blog/kaigo-rpa-automation.html'),
        'blog-kaigo-power-automate-ai': resolve(__dirname, 'blog/kaigo-power-automate-ai.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
});

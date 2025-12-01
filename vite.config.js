import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: './', // Ensures relative paths for assets, useful for GitHub Pages
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                blog: resolve(__dirname, 'blog.html'),
            },
        },
    },
});

import { defineConfig } from 'electron-vite';

import react from '@vitejs/plugin-react';

export default defineConfig({
    main: {
        publicDir: false
    },
    preload: {},
    renderer: {
        plugins: [react()]
    }
})
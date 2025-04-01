import replace from 'rollup-plugin-re';

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  base: '/',
  plugins: [react(), tailwindcss(), tsconfigPaths(),
  replace({
    patterns: [
      {
        match: /js-sha256/,
        test: `eval("require('crypto')")`,
        replace: `require('crypto')`,
      },
      {
        match: /js-sha256/,
        test: `eval("require('buffer').Buffer")`,
        replace: `require('buffer').Buffer`,
      },
    ],
  }),],

})

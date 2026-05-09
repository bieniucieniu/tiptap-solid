import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/menus/index.ts',
  ],
  format: ['esm'],
  clean: true,
  dts: true,
  bundle: true,
  external: [/^@tiptap\//, 'solid-js', 'solid-js/web'],
  platform: 'browser',
})

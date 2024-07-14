import { build } from 'bun';

await build({
  entrypoints: ['./index.ts'],
  outdir: './dist',
  external: ['bun', 'bun:*'],
  target: 'bun',
});


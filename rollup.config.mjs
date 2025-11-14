import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: false,
      exports: 'named',
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: false,
      exports: 'named',
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.build.json',
      declaration: true,
      declarationDir: 'dist',
      exclude: ['**/*.test.*', '**/*.spec.*', 'src/index.tsx', 'src/App.*', 'src/setupTests.ts', 'src/reportWebVitals.ts'],
    }),
    postcss({
      extract: true,
      minimize: true,
      inject: false,
    }),
    terser(),
  ],
  external: ['react', 'react-dom'],
};


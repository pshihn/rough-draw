import minify from 'rollup-plugin-babel-minify';
import resolve from 'rollup-plugin-node-resolve';

export default [
  {
    input: './src/components/app-panel.js',
    output: {
      file: `dist/bundled.js`,
      format: 'es'
    },
    plugins: [resolve(), minify({ comments: false })]
  }
];
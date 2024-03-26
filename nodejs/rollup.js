import * as rollup from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import fs from 'fs';
import { createHash } from 'crypto';

rollup
    .rollup({
        input: ['./src/index.js'],
        plugins: [
            resolve(),
            commonjs(),
            json(),
            babel({
                babelHelpers: 'runtime',
                exclude: 'node_modules/**',
            }),
            terser({
                compress: {
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    warnings: false,
                },
            }),
        ],
        onwarn: function (message) {
            console.log(message.toString());
        },
    })
    .then((build) => {
        build
            .write({
                dir: './dist',
                format: 'cjs',
                entryFileNames: '[name].js',
                plugins: [genMd5()],
            })
            .then((output) => {
                console.log(output.output.map((o) => o.fileName));
            });
    });

function genMd5() {
    return {
        name: 'gen-output-file-md5',
        writeBundle() {
            const md5 = createHash('md5').update(fs.readFileSync('dist/index.js')).digest('hex');
            fs.writeFileSync('dist/index.js.md5', md5);
        },
    };
}

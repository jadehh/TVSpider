import * as esbuild from 'esbuild';
import fs from 'fs';
import { createHash } from 'crypto';

esbuild.build({
    entryPoints: ['src/index.config.js'],
    outfile: 'dist/index.config.js',
    bundle: true,
    minify: false,
    write: true,
    charset: 'utf8',
    format: 'cjs',
    platform: 'node',
    target: 'node18',
    plugins: [genMd5()],
});

function genMd5() {
    return {
        name: 'gen-output-file-md5',
        setup(build) {
            build.onEnd(async (_) => {
                const md5 = createHash('md5').update(fs.readFileSync('dist/index.config.js')).digest('hex');
                fs.writeFileSync('dist/index.config.js.md5', md5);
            });
        },
    };
}

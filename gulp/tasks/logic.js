import gulp from 'gulp';
// import gutil from 'gulp-util';
import { rollup } from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';

let cache;

gulp.task('logic', () => {
    return rollup({
        input: 'src/index.js',
        plugins: [
            nodeResolve({
                jsnext: true,
                main : true,
                module: true,
                browser: true,
            }),
            commonjs(),
            buble()
        ],
        cache: cache,
    }).then(function(bundle) {
        bundle.write({
            file: './dist/build.js',
            format: 'iife'
        });
    })
});

/*
tweaks to make this build, in:
- node_modules/@cycle/dom/lib/es6/IsolateModule.js
- node_modules/@cycle/dom/lib/es6/makeDOMDriver.js:
import * as MapPolyfill from 'es6-map';
->
import MapPolyfill from 'es6-map';
*/

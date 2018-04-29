'use strict';

const libName = require('./package.json').name;
const camelCase = require('camelcase');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const sourcemaps = require('rollup-plugin-sourcemaps');

module.exports = {
  output: {
    name: camelCase(libName),
    // ATTENTION:
    // Add any dependency or peer dependency your library to `globals` and `external`.
    // This is required for UMD bundle users.
    globals: {
      // The key here is library name, and the value is the the name of the global variable name
      // the window object.
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#globals for more.
      '@angular/core': 'ng.core',
      '@angular/common': 'ng.common',
      '@angular/material': 'ng.material',
      '@angular/forms': 'ng.forms',
      'rxjs': 'Rx',
      'rxjs/operators': 'Rx.operators',
      'rxjs/Observable': 'Rx',
      'rxjs/ReplaySubject': 'Rx',
      'rxjs/observable/fromEvent': 'Rx.Observable',
      'rxjs/observable/race': 'Rx.Observable',
      'rxjs/observable/of': 'Rx.Observable',
      'rxjs/observable/throw': 'Rx.Observable'
    }
  },
  external: [
    // List of dependencies
    // See https://github.com/rollup/rollup/wiki/JavaScript-API#external for more.
    '@angular/core',
    '@angular/common',
    '@angular/material',
    '@angular/forms',
    'rxjs',
    'rxjs/operators',
    'rxjs/Observable',
    'rxjs/ReplaySubject',
    'rxjs/observable/fromEvent',
    'rxjs/observable/race',
    'rxjs/observable/of',
    'rxjs/observable/throw'
  ],
  plugins: [
    commonjs({
      include: [
        'node_modules/rxjs/**',
        'node_modules/livr/**'
      ]
    }),
    sourcemaps(),
    nodeResolve({
      jsnext: true,
      module: true,
      main: true,
      browser: true
    })
  ]
};

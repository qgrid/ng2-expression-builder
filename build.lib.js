'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const camelCase = require('camelcase');
const ngc = require('@angular/compiler-cli/src/main').main;
const rollup = require('rollup');
const uglify = require('rollup-plugin-uglify');
const sourcemaps = require('rollup-plugin-sourcemaps');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const alias = require('rollup-plugin-alias');
const sass = require('npm-sass');
const inlineStyles = require('./build.inline');

const libName = require('./package.json').name;
const rootFolder = path.join(__dirname);
const tscFolder = path.join(rootFolder, 'out-tsc');
const srcFolder = path.join(rootFolder, 'src');
const distFolder = path.join(rootFolder, 'dist');
const tempFolder = path.join(tscFolder, 'lib');
const themeFolder = tempFolder;
const es5Folder = path.join(tscFolder, 'es5');
const es2015Folder = path.join(tscFolder, 'es2015');

return Promise.resolve()
  // Copy library to temporary folder and inline html/css.
  .then(() => console.log(`copy: ${srcFolder}`))
  .then(() => relativeCopy(`**/*`, srcFolder, tempFolder))
  .then(() => console.log(`copy: succeeded`))
  .then(() => console.log(`scss: ${themeFolder}`))
  .then(() => {
    const files = glob.sync('**/*.scss', { cwd: themeFolder });
    return Promise.all(files.map(name =>
      new Promise((resolve, reject) => {
        const filePath = path.join(themeFolder, name);
        sass(filePath, (err, result) => {
          if (err) {
            reject(err);
          } else {
            fs.writeFile(filePath.replace('.scss', '.css'), result.css);
            resolve(result);
          }
        });
      })
    ))
  })
  .then(() => console.log(`scss: success`))
  .then(() => console.log(`inline: ${tempFolder}`))
  .then(() => inlineStyles(tempFolder))
  .then(() => console.log('inline: succeeded'))
  // Compile to ES2015.
  .then(() => console.log('ngc: tsconfig.es2015.json'))
  .then(() => ngc(['--project', 'tsconfig.es2015.json']))
  .then(code => code === 0 ? Promise.resolve() : Promise.reject())
  .then(() => console.log('ngc es2015: succeeded'))
  // Compile to ES5.
  .then(() => console.log('ngc: tsconfig.es5.json'))
  .then(() => ngc(['--project', 'tsconfig.es5.json']))
  .then(code => code === 0 ? Promise.resolve() : Promise.reject())
  .then(() => console.log('ngc: succeeded'))
  // Copy typings and metadata to `dist/` folder.
  .then(() => console.log(`copy metadata: ${distFolder}`))
  .then(() => relativeCopy('**/*.d.ts', tempFolder, distFolder))
  .then(() => relativeCopy('**/*.d.ts', es2015Folder, distFolder))
  .then(() => relativeCopy('**/*.metadata.json', es2015Folder, distFolder))
  .then(() => console.log('copy metadata: succeeded'))
  // Bundle lib.
  .then(() => console.log(`bundle: ${libName}`))
  .then(() => {
    const es5Entry = path.join(es5Folder, `${libName}.js`);
    const es2015Entry = path.join(es2015Folder, `${libName}.js`);
    const rollupBaseConfig = {
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
          include: ['node_modules/rxjs/**']
        }),
        sourcemaps(),
        nodeResolve({
          jsnext: true,
          module: true,
          main: true,
          browser: true
        }),
        // alias({
        //   'ng2-': path.join(tempFolder, '/core/'),
        // })
      ]
    };

    // UMD bundle.
    const umdConfig = Object.assign({}, rollupBaseConfig, {
      input: es5Entry,
      output: Object.assign({}, rollupBaseConfig.output, {
        file: path.join(distFolder, `bundles`, `${libName}.umd.js`),
        format: 'umd'
      })
    });

    // Minified UMD bundle.
    const minifiedUmdConfig = Object.assign({}, rollupBaseConfig, {
      input: es5Entry,
      output: Object.assign({}, rollupBaseConfig.output, {
        file: path.join(distFolder, `bundles`, `${libName}.umd.min.js`),
        format: 'umd'
      }),
      plugins: rollupBaseConfig.plugins.concat([uglify({})])
    });

    // ESM+ES5 flat module bundle.
    const fesm5config = Object.assign({}, rollupBaseConfig, {
      input: es5Entry,
      output: Object.assign({}, rollupBaseConfig.output, {
        file: path.join(distFolder, `bundles`, `${libName}.es5.js`),
        format: 'es'
      })
    });

    // ESM+ES2015 flat module bundle.
    const fesm2015config = Object.assign({}, rollupBaseConfig, {
      input: es2015Entry,
      output: Object.assign({}, rollupBaseConfig.output, {
        file: path.join(distFolder, `bundles`, `${libName}.js`),
        format: 'es'
      })
    });

    const allBundles = [
      fesm2015config,
      fesm5config,
      umdConfig,
      minifiedUmdConfig
    ].map(cfg => rollup.rollup(cfg).then(bundle => bundle.write(cfg.output)));

    return Promise.all(allBundles);
  })
  .then(() => console.log('bundle: successed'))
  // Copy package files
  .then(() => console.log('copy package: start'))
  .then(() => relativeCopy('LICENSE', rootFolder, distFolder))
  .then(() => relativeCopy('package.json', rootFolder, distFolder))
  .then(() => relativeCopy('README.md', rootFolder, distFolder))
  .then(() => console.log('copy package: success'))
  .catch(ex => {
    console.error('\nBuild failed. See below for errors.\n');
    console.error(ex);
    process.exit(1);
  });

// Copy files maintaining relative paths.
function relativeCopy(fileGlob, from, to) {
  return new Promise((resolve, reject) => {
    glob(fileGlob, { cwd: from, nodir: true }, (err, files) => {
      if (err) reject(err);
      files.forEach(file => {
        const origin = path.join(from, file);
        const dest = path.join(to, file);
        const data = fs.readFileSync(origin, 'utf-8');
        makeFolderTree(path.dirname(dest));
        fs.writeFileSync(dest, data);
        resolve();
      })
    })
  });
}

// Recursively create a dir.
function makeFolderTree(dir) {
  if (!fs.existsSync(dir)) {
    makeFolderTree(path.dirname(dir));
    fs.mkdirSync(dir);
  }
}

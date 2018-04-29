'use strict';

const libName = require('./package.json').name;
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const ngc = require('@angular/compiler-cli/src/main').main;
const rollup = require('rollup');
const uglify = require('rollup-plugin-uglify');
const alias = require('rollup-plugin-alias');
const sass = require('npm-sass');
const inlineStyles = require('./build.inline');
const rollupConfig = require('./build.rollup');

const rootFolder = path.join(__dirname);
const tscFolder = path.join(rootFolder, 'out-tsc');
const srcFolder = path.join(rootFolder, 'src');
const distFolder = path.join(rootFolder, 'dist');
const tempFolder = tscFolder; // path.join(tscFolder, 'lib');
const themeFolder = tempFolder;
const es5Folder = path.join(tscFolder, 'es5');
const es5Entry = path.join(es5Folder, 'index.js');
const es2015Folder = path.join(tscFolder, 'es2015');
const es2015Entry = path.join(es2015Folder, 'index.js');

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
            fs.writeFileSync(filePath.replace('.scss', '.css'), result.css);
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
  .then(() => console.log('ngc es5: succeeded'))
  // Copy typings and metadata to `dist/` folder.
  .then(() => console.log(`copy metadata: ${distFolder}`))
  .then(() => relativeCopy('**/*.d.ts', es2015Folder, distFolder))
  .then(() => relativeCopy('**/*.metadata.json', es2015Folder, distFolder))
  .then(() => console.log('copy metadata: succeeded'))
  // Bundle lib.
  .then(() => console.log(`bundle umd: ${libName}`))
  .then(() => {
    const cfg = Object.assign({}, rollupConfig, {
      input: es5Entry,
      output: Object.assign({}, rollupConfig.output, {
        file: path.join(distFolder, `bundles`, `${libName}.umd.js`),
        format: 'umd'
      })
    });

    return rollup.rollup(cfg).then(bundle => bundle.write(cfg.output));
  }) 
  .then(() => console.log('bundle umd: succeeded'))
  .then(() => console.log(`bundle umd.min: ${libName}`))
  .then(() => {
    const cfg = Object.assign({}, rollupConfig, {
      input: es5Entry,
      output: Object.assign({}, rollupConfig.output, {
        file: path.join(distFolder, `bundles`, `${libName}.umd.min.js`),
        format: 'umd'
      }),
      plugins: rollupConfig.plugins.concat([uglify({})])
    });

    return rollup.rollup(cfg).then(bundle => bundle.write(cfg.output));
  }) 
  .then(() => console.log('bundle umd.min: succeeded'))
  .then(() => console.log(`bundle es5: ${libName}`))
  .then(() => {
    const cfg = Object.assign({}, rollupConfig, {
      input: es5Entry,
      output: Object.assign({}, rollupConfig.output, {
        file: path.join(distFolder, `bundles`, `${libName}.es5.js`),
        format: 'es'
      })
    });
    return rollup.rollup(cfg).then(bundle => bundle.write(cfg.output));
  }) 
  .then(() => console.log('bundle es5: succeeded'))
  .then(() => console.log(`bundle es2015: ${libName}`))
  .then(() => {
    const cfg = Object.assign({}, rollupConfig, {
      input: es2015Entry,
      output: Object.assign({}, rollupConfig.output, {
        file: path.join(distFolder, `bundles`, `${libName}.js`),
        format: 'es'
      })
    });

    return rollup.rollup(cfg).then(bundle => bundle.write(cfg.output));
  }) 
  .then(() => console.log('bundle es2015: succeeded'))
  .then(() => console.log('bundle: successed'))
  // Copy package files
  .then(() => console.log('copy package: start'))
  .then(() => relativeCopy('LICENSE', rootFolder, distFolder))
  .then(() => relativeCopy('package.json', tscFolder, distFolder))
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
      if (err) {
        reject(err);
      }

      files.forEach(file => {
        const origin = path.join(from, file);
        const dest = path.join(to, file);
        const data = fs.readFileSync(origin, 'utf-8');
        makeFolderTree(path.dirname(dest));
        fs.writeFileSync(dest, data);
        console.log(`copy: ${file}`);
      });

      resolve();
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

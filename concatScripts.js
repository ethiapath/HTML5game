const shell = require('shelljs')
const fs    = require('fs')

function concatScript() {
  const scriptNames = [
    'setup.js',
    'NetworkWrapper.js',
    'helper.js',
    'classes.js',
    'levels.js',
    'gameloop.js'
  ];
  const scrdir = 'scripts/';
  let scriptPaths = scriptNames.map(s => scrdir + s);
  console.log(scriptPaths)
  let scriptPayload = shell.cat(...scriptPaths).stdout;

  console.log(scriptPayload)
  // write scriptPayload to disk as script.js
  fs.writeFileSync('script.js', scriptPayload)
  console.log('scripts concatenated.');
  console.log(typeof scriptPayload);
}

concatScript()

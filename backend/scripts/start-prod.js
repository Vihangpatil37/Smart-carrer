const fs = require('fs');
const path = require('path');

const candidates = [
  path.resolve(__dirname, '../dist/main.js'),
  path.resolve(__dirname, '../dist/src/main.js'),
  path.resolve(process.cwd(), 'dist/main.js'),
  path.resolve(process.cwd(), 'dist/src/main.js'),
];

const target = candidates.find((p) => fs.existsSync(p));
if (!target) {
  console.error('ERROR: Could not find compiled main.js in dist/ or dist/src/');
  console.error('Checked paths:\n' + candidates.join('\n'));
  process.exit(1);
}

require(target);

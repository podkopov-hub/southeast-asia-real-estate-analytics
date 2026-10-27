'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
fs.copyFileSync(path.join(root, 'index.js'), path.join(root, 'docs/engine.js'));
console.log('Demo engine copied from the exact package source.');

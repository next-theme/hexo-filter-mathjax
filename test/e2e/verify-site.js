'use strict';

const fs = require('node:fs');
const path = require('node:path');

function walk(dir) {
  return fs.readdirSync(dir, {
    withFileTypes: true
  }).flatMap(entry => {
    const entryPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

const publicDir = path.join(process.cwd(), 'public');
const htmlPath = walk(publicDir).find(file => {
  const normalized = file.split(path.sep).join('/');
  return normalized.endsWith('/mathjax-regression/index.html');
});

if (!htmlPath) {
  throw new Error('Generated MathJax regression page was not found');
}

const html = fs.readFileSync(htmlPath, 'utf8');
const errors = [
  'data-mjx-error',
  'Undefined control sequence',
  "Can't find handler for document"
].filter(message => html.includes(message));

if (errors.length) {
  throw new Error(`Generated MathJax output contains errors: ${errors.join(', ')}`);
}

if (!html.includes('<mjx-container') || !html.includes('<svg')) {
  throw new Error('Generated MathJax output does not contain SVG rendering');
}

const fs = require('fs');
const path = require('path');
const css = fs.readFileSync(path.resolve(__dirname, '../style.css'), 'utf8');

module.exports = css;

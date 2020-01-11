/* global hexo */

'use strict';

var config = hexo.config.mathjax = Object.assign({
  single_dollars: true,
  cjk_char_width: 16,
  svg: true
}, hexo.config.mathjax);

const { mjpage } = require('mathjax-node-page');
const fs = require('fs');
const path = require('path');
const css = fs.readFileSync(path.resolve(__dirname, 'style.css'), 'utf8');

hexo.extend.filter.register('after_post_render', data => {
  if (!data.mathjax) return;
  return new Promise((resolve, reject) => {
    mjpage(data.content, {
      format: ["TeX"],
      singleDollars: config.single_dollars,
      fragment: true,
      cssInline: false
    }, {
      cjkCharWidth: config.cjk_char_width,
      svg: config.svg
    }, output => {
      data.content = output;
      resolve(data); // resulting HTML string
    });
  });
}, 5);

hexo.extend.filter.register('after_render:html', data => {
  return data.replace(/<head>(?!<\/head>).+?<\/head>/s, str => str.replace('</head>', `<style>${css}</style></head>`));
});

/* global hexo */

'use strict';

var config = hexo.config.mathjax = Object.assign({
  single_dollars: true,
  ex_factor     : 0.5
}, hexo.config.mathjax);

//
//  Load the packages needed for MathJax
//
const { mathjax } = require('mathjax-full/js/mathjax.js');
const { TeX } = require('mathjax-full/js/input/tex.js');
const { SVG } = require('mathjax-full/js/output/svg.js');
const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor.js');
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js');

const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages.js');

//
//  Create DOM adaptor and register it for HTML documents
//
const adaptor = liteAdaptor({
  fontSize: 16
});
RegisterHTMLHandler(adaptor);

//
//  Create input and output jax and a document using them on the content from the HTML file
//
const tex = new TeX({
  packages  : AllPackages,
  inlineMath: config.single_dollars ? {
    '[+]': [['$', '$']]
  } : {}
});
const svg = new SVG({
  fontCache: 'global',
  exFactor : config.ex_factor
});

hexo.extend.filter.register('after_post_render', data => {
  if (!data.mathjax) return;
  const html = mathjax.document(data.content, {
    InputJax : tex,
    OutputJax: svg
  });

  //
  //  Typeset the document
  //
  html.render();

  //
  //  Output the resulting HTML
  //
  data.content = adaptor.innerHTML(adaptor.body(html.document));
  return data;
}, 5);

const fs = require('fs');
const path = require('path');
const css = fs.readFileSync(path.resolve(__dirname, 'style.css'), 'utf8');

hexo.extend.filter.register('after_render:html', data => {
  return data.replace(/<head>(?!<\/head>).+?<\/head>/s, str => str.replace('</head>', `<style>${css}</style></head>`));
});

/* global hexo */

'use strict';

const stringWidth = require("string-width");

var config = hexo.config.mathjax = Object.assign({
  tags          : 'none',
  single_dollars: true,
  cjkWidth      : 0.9,
  normalWidth   : 0.6
}, hexo.config.mathjax);

//
//  Load the packages needed for MathJax
//
const { mathjax } = require('mathjax-full/js/mathjax.js');
const { TeX } = require('mathjax-full/js/input/tex.js');
const { SVG } = require('mathjax-full/js/output/svg.js');
const { LiteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor.js');
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js');

const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages.js');

//
//  Create DOM adaptor and register it for HTML documents
//
class myAdaptor extends LiteAdaptor {
  value(node) {
    return node.value;
  }
  nodeSize(node) {
    const cjk = this.options.cjkWidth;
    const width = this.options.normalWidth;
    const text = this.textContent(node);
    let w = 0;
    for (const c of text.split("")) {
      w += (stringWidth(c) === 2 ? cjk : width);
    }
    return [w, 0];
  }
}
myAdaptor.OPTIONS = {
  ...LiteAdaptor.OPTIONS,
  cjkWidth   : 0.9,
  normalWidth: 0.6
};

const adaptor = new myAdaptor({
  fontSize   : 16,
  cjkWidth   : config.cjkWidth,
  normalWidth: config.normalWidth
});
RegisterHTMLHandler(adaptor);

hexo.extend.filter.register('after_post_render', data => {
  if (!data.mathjax) return;

  //
  //  Create input and output jax and a document using them on the content from the HTML file
  //
  const tex = new TeX({
    packages  : AllPackages,
    tags      : config.tags,
    inlineMath: config.single_dollars ? {
      '[+]': [['$', '$']]
    } : {}
  });
  const svg = new SVG({
    fontCache: 'global'
  });
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

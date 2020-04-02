const stringWidth = require('string-width');

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
    for (const c of text.split('')) {
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

module.exports = function(config) {

  const adaptor = new myAdaptor({
    fontSize   : 16,
    cjkWidth   : config.cjk_width,
    normalWidth: config.normal_width
  });
  RegisterHTMLHandler(adaptor);

  return function(content) {

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
    const html = mathjax.document(content, {
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
    return adaptor.innerHTML(adaptor.body(html.document));
  };
}

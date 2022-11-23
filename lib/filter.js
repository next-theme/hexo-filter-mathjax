//
//  Load the packages needed for MathJax
//
const { mathjax } = require('mathjax-full/js/mathjax.js');
const { TeX } = require('mathjax-full/js/input/tex.js');
const { SVG } = require('mathjax-full/js/output/svg.js');
const { LiteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor.js');
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js');

let { AllPackages } = require('mathjax-full/js/input/tex/AllPackages.js');

module.exports = function(config) {

  //
  //  Create DOM adaptor and register it for HTML documents
  //
  const adaptor = new LiteAdaptor({
    fontSize        : 16,
    cjkCharWidth    : config.cjk_width,
    unknownCharWidth: config.normal_width
  });
  RegisterHTMLHandler(adaptor);

  return function(content) {

    //
    //  Create input and output jax and a document using them on the content from the HTML file
    //
    if (Array.isArray(config.packages)) {
      AllPackages = AllPackages.concat(config.packages);
    }
    const tex = new TeX(Object.assign({
      packages  : AllPackages,
      tags      : config.tags,
      inlineMath: config.single_dollars ? {
        '[+]': [['$', '$']]
      } : {}
    }, config.extension_options));
    const svg = new SVG({
      fontCache: 'none'
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
};

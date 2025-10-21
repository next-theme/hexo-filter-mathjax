//
//  Load the packages needed for MathJax
//
const { mathjax } = require('@mathjax/src/js/mathjax.js');
const { TeX } = require('@mathjax/src/js/input/tex.js');
const { SVG } = require('@mathjax/src/js/output/svg.js');
const { LiteAdaptor } = require('@mathjax/src/js/adaptors/liteAdaptor.js');
const { RegisterHTMLHandler } = require('@mathjax/src/js/handlers/html.js');

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
  const texConfig = {
    tags      : config.tags,
    inlineMath: config.single_dollars ? {
      '[+]': [['$', '$']]
    }: {},
  };
  if (Array.isArray(config.packages)) {
    texConfig.packages = config.packages;
  }
  Object.assign(texConfig, config.extension_options);

  return function(content) {

    //
    //  Create input and output jax and a document using them on the content from the HTML file
    //
    const tex = new TeX(texConfig);
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

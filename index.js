/* global hexo */

'use strict';

const config = hexo.config.mathjax = Object.assign({
  tags          : 'none',
  single_dollars: true,
  cjk_width     : 0.9,
  normal_width  : 0.6,
  append_css    : true,
  every_page    : false
}, hexo.config.mathjax);

const mathjax = require('./lib/filter')(config);

hexo.extend.filter.register('after_post_render', data => {
  if (!data.mathjax && !config.every_page) return;

  data.content = mathjax(data.content);
  return data;
}, 5);

if (config.append_css) {
  const css = require('./lib/css');

  hexo.extend.filter.register('after_render:html', data => {
    // add unique token to prevent replacing repeatedly
    if (data.match(`<meta name="hexo-filter-mathjax-css" content="placeholder">`)) return;
    return data.replace(/<head>(?!<\/head>).+?<\/head>/s, str => str.replace('</head>',
          `<meta name="hexo-filter-mathjax-css" content="placeholder"> <style>${css}</style></head>`));
  });
}

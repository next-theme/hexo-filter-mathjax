/* global hexo */

'use strict';

const config = hexo.config.mathjax = Object.assign({
  tags          : 'none',
  single_dollars: true,
  cjk_width     : 0.9,
  normal_width  : 0.6
}, hexo.config.mathjax);

const mathjax = require('./lib/filter')(config);

hexo.extend.filter.register('after_post_render', data => {
  if (!data.mathjax) return;

  data.content = mathjax(data.content);
  return data;
}, 5);

const css = require('./lib/css');

hexo.extend.filter.register('after_render:html', data => {
  return data.replace(/<head>(?!<\/head>).+?<\/head>/s, str => str.replace('</head>', `<style>${css}</style></head>`));
});

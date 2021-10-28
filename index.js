/* global hexo */

'use strict';

const config = hexo.config.mathjax = Object.assign({
  tags             : 'none',
  single_dollars   : true,
  cjk_width        : 0.9,
  normal_width     : 0.6,
  append_css       : true,
  every_page       : false,
  extension_options: {}
}, hexo.config.mathjax);

const mathjax = require('./lib/filter')(config);

hexo.extend.filter.register('after_post_render', data => {
  if (!data.mathjax && !config.every_page) return;

  data.content = mathjax(data.content);
  return data;
}, 5);

if (config.append_css) {
  const css = require('./lib/css');

  hexo.extend.filter.register('after_render:html', (html, { page }) => {
    if (config.every_page || page.mathjax || (page.__index && page.posts.toArray().find(post => post.mathjax))) {
      return html.replace(/<head>(?!<\/head>).+?<\/head>/s, str => str.replace('</head>', `<style>${css}</style></head>`));
    }
    return html;
  });
}

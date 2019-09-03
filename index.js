/* global hexo */

'use strict';

const merge = require('lodash/merge');

var config = hexo.config.mathjax = merge({
  single_dollars: true,
  cjk_char_width: 16,
  svg: true
}, hexo.config.mathjax);

const mjpage = require('mathjax-node-page').mjpage;

hexo.extend.filter.register('after_post_render', data => {
  if (!data.mathjax) return;
  return new Promise((resolve, reject) => {
    mjpage(data.content, {
      format: ["TeX"],
      singleDollars: config.single_dollars
    }, {
      cjkCharWidth: config.cjk_char_width,
      svg: config.svg
    }, function(output) {
      data.content = output;
      resolve(data); // resulting HTML string
    });
  });
}, 5);

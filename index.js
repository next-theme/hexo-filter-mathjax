/* global hexo */

'use strict';

var merge = require('utils-merge');

var config = hexo.config.mathjax = merge({
  single_dollars: true,
  cjk_char_width: 16,
  svg: true
}, hexo.config.mathjax);

const co = require('co');
const mjpage = require('mathjax-node-page/lib/main.js').mjpage;

function renderMathjax(tex) {
  return new Promise((resolve, reject) => {
    mjpage(tex, {
    	format: ["TeX"],
    	singleDollars: config.single_dollars
    }, {
    	cjkCharWidth: config.cjk_char_width,
    	svg: config.svg
    }, function(output) {
      resolve(output); // resulting HTML string
    });
  });
}

hexo.extend.filter.register('after_post_render', data => {
	if (!data.mathjax) return;
  return co(function *() {
    data.content = yield renderMathjax(data.content);
    return data;
  });
}, 5);

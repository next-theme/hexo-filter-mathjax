/* global hexo */

'use strict';

const co = require('co');
const mjpage = require('mathjax-node-page/lib/main.js').mjpage;

function renderMathjax(tex) {
  return new Promise((resolve, reject) => {
    mjpage(tex, {
    	format: ["TeX"],
    	singleDollars: true
    }, {
    	cjkCharWidth: 16,
    	svg: true
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

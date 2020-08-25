'use strict';

require('chai').should();

const config = {
  tags: 'none',
  single_dollars: true,
  cjk_width: 0.9,
  normal_width: 0.6,
  append_css: true,
  every_page: false
};

const mathjax = require('../lib/filter')(config);
const content = '$E=mc^2$';
const comment = '<!-- more -->';

describe('MathJax', () => {

  it('default', () => {
    mathjax(content).should.include('svg');
  });

  it('comment', () => {
    mathjax(`${content}\n${comment}\n${content}`).should.include(comment);
  });
});

'use strict';

require('chai').should();

const config = {
  tags             : 'none',
  single_dollars   : true,
  cjk_width        : 0.9,
  normal_width     : 0.6,
  append_css       : true,
  every_page       : false,
  extension_options: {
    macros: {
      Rarr: '\\Rightarrow'
    }
  }
};

const mathjax = require('../lib/filter')(config);
const content = '$E=mc^2$';
const comment = '<!-- more -->';
const macros = '$A \\vee B \\Rarr A$';

describe('MathJax', () => {

  it('default', () => {
    mathjax(content).should.include('svg');
  });

  it('comment', () => {
    mathjax(`${content}\n${comment}\n${content}`).should.include(comment);
  });

  it('macro', () => {
    mathjax(`${macros}`).should.not.include('fill="red"');
  });
});

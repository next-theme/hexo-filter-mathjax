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
    // macros: {
    //   Rarr: '\\Rightarrow'
    // }
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
    // mathjax(`${macros}`).should.not.include('Undefined control sequence');
  });

  it('cjk', () => {
    mathjax(`$$\\mu(n)=
\\begin{cases}
1 & n是偶数个不同的素数相乘\\\\
-1 & n是奇数个不同的素数相乘\\\\
0 & n被某个素数的平方整除
\\end{cases}
$$`).should.include('svg');
  });
});

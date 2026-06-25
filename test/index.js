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
const mathjaxWithRequireObject = require('../lib/filter')(Object.assign({}, config, {
  packages: {
    '[+]': ['require']
  }
}));
const mathjaxWithPhysics = require('../lib/filter')(Object.assign({}, config, {
  packages: ['physics']
}));
const mathjaxWithAmsTags = require('../lib/filter')(Object.assign({}, config, {
  tags: 'ams'
}));
const mathjaxWithRequireNoPhysics = require('../lib/filter')(Object.assign({}, config, {
  extension_options: {
    require: {
      allow: {
        physics: false
      }
    }
  }
}));
const mathjaxWithMacros = require('../lib/filter')(Object.assign({}, config, {
  extension_options: {
    macros: {
      Rarr: '\\Rightarrow'
    }
  }
}));
const content = '$E=mc^2$';
const comment = '<!-- more -->';

describe('MathJax', () => {

  it('default', async () => {
    (await mathjax(content)).should.include('svg');
  });

  it('comment', async () => {
    (await mathjax(`${content}\n${comment}\n${content}`)).should.include(comment);
  });

  it('macro', async () => {
    const macros = '$A \\vee B \\Rarr A$';
    (await mathjaxWithMacros(macros)).should.not.include('Undefined control sequence');
  });

  it('require', async () => {
    const macros = '$\\require{enclose}\\enclose{circle}{x}$';
    (await mathjax(macros)).should.include('svg');
    (await mathjax(macros)).should.not.include('data-mjx-error');
  });

  it('require loads packages locally', async () => {
    (await mathjax('$\\qty(x)$')).should.include('Undefined control sequence');
    (await mathjax('$\\require{physics}\\qty(x)$')).should.not.include('Undefined control sequence');
    (await mathjax('$\\qty(x)$')).should.include('Undefined control sequence');
  });

  it('require loads package dependencies', async () => {
    (await mathjax('$\\require{cancel}\\cancel{x}$')).should.not.include('data-mjx-error');
  });

  it('require runs package preprocessors', async () => {
    (await mathjax('$\\require{textcomp}\\text{a \\bf b}$')).should.not.include('data-mjx-error');
  });

  it('autoloads MathJax packages', async () => {
    (await mathjax('$\\color{red}{x} \\quad \\verb|x| \\quad \\cancel{x}$')).should.not.include('data-mjx-error');
  });

  it('autoloads MathJax font extensions', async () => {
    (await mathjax('$\\ce{C6H5-CHO} \\quad \\ce{$A$ ->[\\ce{+H2O}] $B$}$')).should.not.include('data-mjx-error');
  });

  it('require supports MathJax package append syntax', async () => {
    (await mathjaxWithRequireObject('$\\require{enclose}\\enclose{circle}{x}$')).should.not.include('data-mjx-error');
  });

  it('packages load global extensions', async () => {
    (await mathjaxWithPhysics('$\\qty(x)$')).should.not.include('Undefined control sequence');
  });

  it('ams tags load the ams package', async () => {
    (await mathjaxWithAmsTags('$$x=1$$')).should.not.include('Unknown tags class');
  });

  it('loads dynamic svg fonts', async () => {
    (await mathjax('$\\mathbb{R} \\quad \\mathcal{L}$')).should.not.include('data-mjx-error');
  });

  it('require respects extension options', async () => {
    (await mathjaxWithRequireNoPhysics('$\\require{physics}\\qty(x)$')).should.include('not allowed');
  });

  it('cjk', async () => {
    (await mathjax(`$$\\mu(n)=
\\begin{cases}
1 & n是偶数个不同的素数相乘\\\\
-1 & n是奇数个不同的素数相乘\\\\
0 & n被某个素数的平方整除
\\end{cases}
$$`)).should.include('svg');
  });
});

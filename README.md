# Hexo Filter MathJax

[![npm-image]][npm-url]
[![lic-image]](LICENSE)

Server side [MathJax](http://www.mathjax.org/) Renderer Plugin for [Hexo](http://hexo.io/).

**WARNING: No front-end scripts and other Math plugins are required. Remove them ALL before using this plugin.**

## Installation

![size-image]
[![dm-image]][npm-url]
[![dt-image]][npm-url]

```bash
$ npm install hexo-filter-mathjax
```

## Options

You can configure this plugin in Hexo `_config.yml`. Default options:

```yaml
mathjax:
  single_dollars: true
  ex_factor: 0.5
```

## Usage

Set `mathjax: true` in Front-matter of each article (post / page) that you would like to enable mathjax. Example:

```md
---
title: Title
categories: Physics
date: 1984-01-24 16:00:00
tags:
mathjax: true
---
```

Then you can use the LaTeX syntax in the article.

### Renderer

If you are using `hexo-renderer-marked`, you need to be aware of the conflict between LaTeX and Markdown syntax. For example, you need to use `\` to escape:  
`$\epsilon_0$` → `$\epsilon\_0$`  
`\begin{eqnarray*}` → `\begin{eqnarray\*}`

## Sample

Write the following LaTeX code:
```
$$
i\hbar\frac{\partial}{\partial t}\psi=-\frac{\hbar^2}{2m}\nabla^2\psi+V\psi
$$
```
Then you will get:

![](sample1.svg)

```
\begin{eqnarray\*}
\nabla\cdot\vec{E}&=&\frac{\rho}{\epsilon_0}\\\\
\nabla\cdot\vec{B}&=&0\\\\
\nabla\times\vec{E}&=&-\frac{\partial B}{\partial t}\\\\
\nabla\times\vec{B}&=&\mu_0\left(\vec{J}+\epsilon_0\frac{\partial E}{\partial t}\right)\\\\
\end{eqnarray\*}
```

![](sample2.svg)

## License

Released under the MIT License

[npm-image]: https://img.shields.io/npm/v/hexo-filter-mathjax?style=flat-square
[lic-image]: https://img.shields.io/npm/l/hexo-filter-mathjax?style=flat-square

[size-image]: https://img.shields.io/github/languages/code-size/stevenjoezhang/hexo-filter-mathjax?style=flat-square
[dm-image]: https://img.shields.io/npm/dm/hexo-filter-mathjax?style=flat-square
[dt-image]: https://img.shields.io/npm/dt/hexo-filter-mathjax?style=flat-square

[npm-url]: https://www.npmjs.com/package/hexo-filter-mathjax

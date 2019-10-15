# Hexo Filter MathJax

[![npm-image]][npm-url]
[![lic-image]](LICENSE)

Server side [MathJax](http://www.mathjax.org/) Renderer Plugin for [Hexo](http://hexo.io/). No front-end scripts are required.

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
  cjk_char_width: 16
  svg: true
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

## Sample

Write the following LaTeX code:
```
$$
\frac{\partial u}{\partial t} = h^2 \left( \frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} + \frac{\partial^2 u}{\partial z^2}\right)
$$
```
Then you will get:

![sample](sample.png)

## License

Released under the MIT License

[npm-image]: https://img.shields.io/npm/v/hexo-filter-mathjax?style=flat-square
[lic-image]: https://img.shields.io/npm/l/hexo-filter-mathjax?style=flat-square

[size-image]: https://img.shields.io/github/languages/code-size/stevenjoezhang/hexo-filter-mathjax?style=flat-square
[dm-image]: https://img.shields.io/npm/dm/hexo-filter-mathjax?style=flat-square
[dt-image]: https://img.shields.io/npm/dt/hexo-filter-mathjax?style=flat-square

[npm-url]: https://www.npmjs.com/package/hexo-filter-mathjax

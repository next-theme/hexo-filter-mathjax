# Hexo Filter MathJax

[![Npm Version](https://img.shields.io/npm/v/hexo-filter-mathjax.svg)](https://npmjs.org/package/hexo-filter-mathjax)
[![Npm Downloads Month](https://img.shields.io/npm/dm/hexo-filter-mathjax.svg)](https://npmjs.org/package/hexo-filter-mathjax)
[![Npm Downloads Total](https://img.shields.io/npm/dt/hexo-filter-mathjax.svg)](https://npmjs.org/package/hexo-filter-mathjax)
[![License](https://img.shields.io/npm/l/hexo-filter-mathjax.svg)](https://npmjs.org/package/hexo-filter-mathjax)

**MathJax Renderer Plugin for Hexo**.  
Add support of [MathJax](http://www.mathjax.org/) for [Hexo](http://hexo.io/).

## Installation
```bash
$ npm install hexo-filter-mathjax --save
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

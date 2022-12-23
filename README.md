# Hexo Filter MathJax

[![npm-image]][npm-url]
[![lic-image]](LICENSE)

Server side [MathJax](http://www.mathjax.org/) Renderer Plugin for [Hexo](http://hexo.io/).

**WARNING: This plugin is a server-side math rendering plugin, which does not depend on any front-end scripts. If you have already enabled other math rendering methods before installing this plugin, please do the following to avoid conflicts:**
- Remove all other Hexo math plugins
- Disable front-end math renderer in Hexo theme settings (For theme NexT, you need to set both `math.mathjax.enable` and `math.katax.enable` to `false`)
- Delete front-end scripts related to math rendering

## Installation

![size-image]
[![dm-image]][npm-url]
[![dt-image]][npm-url]

```bash
$ npm install hexo-filter-mathjax
$ hexo clean
```

## Options

You can configure this plugin in Hexo `_config.yml`. Default options:

```yaml
mathjax:
  tags: none # or 'ams' or 'all'
  single_dollars: true # enable single dollar signs as in-line math delimiters
  cjk_width: 0.9 # relative CJK char width
  normal_width: 0.6 # relative normal (monospace) width
  append_css: true # add CSS to pages rendered by MathJax
  every_page: false # if true, every page will be rendered by MathJax regardless the `mathjax` setting in Front-matter
  packages: # extra packages to load
  extension_options: {}
    # you can put your extension options here
    # see http://docs.mathjax.org/en/latest/options/input/tex.html#tex-extension-options for more detail
```

## Usage

Set `mathjax: true` in Front-matter of each article (post / page) that you would like to enable MathJax. For example:

```md
---
title: On the Electrodynamics of Moving Bodies
categories: Physics
date: 1905-06-30 12:00:00
mathjax: true
---
```

Then you can use the LaTeX syntax in the article.

### Renderer

[hexo-renderer-pandoc](https://github.com/wzpan/hexo-renderer-pandoc) is recommended because it can handle mathematical formulas in markdown documents perfectly. But you need to be aware that inline Math (..`$...$`) must not have white spaces **after the opening `$` and before the ending `$`**. For example:
```diff
-$ \epsilon_0 $
+$\epsilon_0$
-$ \frac{\partial}{\partial t} $
+$\frac{\partial}{\partial t}$
```

If you are using other renderers, such as [hexo-renderer-marked](https://github.com/hexojs/hexo-renderer-marked), you need to be aware of the conflict between LaTeX and Markdown syntax. For example, an underscore (`_`) may be interpreted as the start of italic text in Markdown, or subscripted mark in TeX. Use `\` to escape if necessary:
```diff
-$\epsilon_0$
+$\epsilon\_0$
-\begin{eqnarray*}
+\begin{eqnarray\*}
-\\
+\\\\
```

## Sample

Write the following LaTeX code:
```
$$
i\hbar\frac{\partial}{\partial t}\psi=-\frac{\hbar^2}{2m}\nabla^2\psi+V\psi
$$
```

```
\begin{eqnarray\*}
\nabla\cdot\vec{E}&=&\frac{\rho}{\epsilon_0}\\\\
\nabla\cdot\vec{B}&=&0\\\\
\nabla\times\vec{E}&=&-\frac{\partial B}{\partial t}\\\\
\nabla\times\vec{B}&=&\mu_0\left(\vec{J}+\epsilon_0\frac{\partial E}{\partial t}\right)\\\\
\end{eqnarray\*}
```

Then you will get:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/sample1-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/sample1-light.svg">
  <img src="assets/sample1-light.svg">
</picture>
<br>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/sample2-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/sample2-light.svg">
  <img src="assets/sample2-light.svg">
</picture>

## Known Issues

Long equations with labels may cause horizontal overflow, because a `min-width` CSS property will be added to `mjx-container` elements by MathJax.

## License

Released under the MIT License

[npm-image]: https://img.shields.io/npm/v/hexo-filter-mathjax?style=flat-square
[lic-image]: https://img.shields.io/npm/l/hexo-filter-mathjax?style=flat-square

[size-image]: https://img.shields.io/github/languages/code-size/next-theme/hexo-filter-mathjax?style=flat-square
[dm-image]: https://img.shields.io/npm/dm/hexo-filter-mathjax?style=flat-square
[dt-image]: https://img.shields.io/npm/dt/hexo-filter-mathjax?style=flat-square

[npm-url]: https://www.npmjs.com/package/hexo-filter-mathjax

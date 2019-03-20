# Hexo Filter MathJax

[![Npm Version](https://img.shields.io/npm/v/hexo-filter-mathjax.svg)](https://npmjs.org/package/hexo-filter-mathjax)
[![Npm Downloads Month](https://img.shields.io/npm/dm/hexo-filter-mathjax.svg)](https://npmjs.org/package/hexo-filter-mathjax)
[![Npm Downloads Total](https://img.shields.io/npm/dt/hexo-filter-mathjax.svg)](https://npmjs.org/package/hexo-filter-mathjax)
[![License](https://img.shields.io/npm/l/hexo-filter-mathjax.svg)](https://npmjs.org/package/hexo-filter-mathjax)

**MathJax Renderer Plugin for Hexo**.  
Add support of [MathJax](http://www.mathjax.org/) for [Hexo](http://hexo.io/).

## INSTALL
```bash
$ npm install hexo-filter-mathjax --save
```
Edit `_config.yml`:
```yaml
plugins:
  - hexo-filter-mathjax
```
## Sample

Write the following latex code:
```
$$
\frac{\partial u}{\partial t} = h^2 \left( \frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} + \frac{\partial^2 u}{\partial z^2}\right)
$$
```
Then you will get:

![sample](sample.png)

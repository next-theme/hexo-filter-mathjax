'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const postDir = path.join(root, 'source', '_posts');
const postPath = path.join(postDir, 'mathjax-regression.md');
const configPath = path.join(root, '_config.yml');

fs.mkdirSync(postDir, {
  recursive: true
});

fs.writeFileSync(postPath, String.raw`---
title: MathJax regression
date: 2026-07-03 00:00:00
mathjax: true
---

Inline math: $E=mc^2$.

Require package:

$$
\require{physics}\qty(x) \quad \vb{a}
$$

Autoload packages:

$$
\color{red}{x} \quad \verb|x| \quad \cancel{x}
$$

Font extension:

$$
\ce{C6H5-CHO} \quad \mathbb{R} \quad \mathcal{L}
$$
`);

fs.appendFileSync(configPath, `

mathjax:
  tags: none
  single_dollars: true
`);

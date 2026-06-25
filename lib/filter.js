//
//  Load the packages needed for MathJax
//
const { mathjax } = require('@mathjax/src/js/mathjax.js');
const { TeX } = require('@mathjax/src/js/input/tex.js');
const { SVG } = require('@mathjax/src/js/output/svg.js');
const { LiteAdaptor } = require('@mathjax/src/js/adaptors/liteAdaptor.js');
const { RegisterHTMLHandler } = require('@mathjax/src/js/handlers/html.js');
require('@mathjax/src/js/util/asyncLoad/node.js');
const { MathJaxNewcmFont } = require('@mathjax/mathjax-newcm-font/cjs/svg.js');
const { source } = require('@mathjax/src/components/js/source.js');
const { dependencies, paths, provides } = require('@mathjax/src/components/js/dependencies.js');
const { Loader, CONFIG } = require('@mathjax/src/js/components/loader.js');

const texExtensions = Object.keys(source).filter(name => name.startsWith('[tex]/'));
const loadedComponents = new Set();
const requireDisallow = new Set([
  'base',
  'autoload',
  'configmacros',
  'setoptions',
  'tagformat',
  'texhtml'
]);

CONFIG.require = require;
Object.assign(CONFIG.source, source);
Object.assign(CONFIG.dependencies, dependencies);
Object.assign(CONFIG.paths, paths);
Object.assign(CONFIG.provides, provides);

const requireAllow = texExtensions.reduce((allow, extension) => {
  const name = extension.substring('[tex]/'.length);
  const allowed = !requireDisallow.has(name);
  allow[extension] = allowed;
  allow[name] = allowed;
  return allow;
}, {
  base: false
});

function normalizeTexPackage(name) {
  return name.startsWith('[tex]/') ? name : `[tex]/${name}`;
}

function loadComponent(name) {
  if (loadedComponents.has(name) || !source[name]) return;
  for (const dependency of CONFIG.dependencies[name] || []) {
    loadComponent(dependency);
  }
  require(source[name]);
  Loader.preLoaded(name);
  loadedComponents.add(name);
}

function loadTexPackages(packages) {
  for (const name of packageList(packages)) {
    loadComponent(normalizeTexPackage(name));
  }
}

function loadRequiredPackages(content) {
  const pattern = /\\require\s*\{([_a-zA-Z0-9]+)\}/g;
  for (const match of content.matchAll(pattern)) {
    loadComponent(normalizeTexPackage(match[1]));
  }
}

function appendPackages(packages) {
  return Array.isArray(packages) ? {
    '[+]': packages
  } : packages;
}

function packageList(packages) {
  if (Array.isArray(packages)) return packages;
  if (packages && typeof packages === 'object') return Object.values(packages).flat();
  return [];
}

function addPackages(packages, additions) {
  if (!additions.length) return packages;
  if (!packages) {
    return {
      '[+]': additions
    };
  }
  const current = packageList(packages);
  const next = additions.filter(name => !current.includes(name));
  if (!next.length) return packages;
  return Object.assign({}, packages, {
    '[+]': (packages['[+]'] || []).concat(next)
  });
}

function needsConfigMacros(options = {}) {
  return Boolean(options.macros || options.active || options.environments);
}

function packagesForTags(tags) {
  return tags === 'ams' ? ['ams'] : [];
}

function needsRequireOptions(packages) {
  const list = packageList(packages);
  return list.includes('require') || list.includes('[tex]/require');
}

function requireAllowWithUserOptions(allowOptions = {}) {
  const allow = Object.assign({}, requireAllow);
  for (const [name, allowed] of Object.entries(allowOptions)) {
    const extension = normalizeTexPackage(name);
    allow[name] = allowed;
    if (source[extension]) {
      allow[extension] = allowed;
      allow[extension.substring('[tex]/'.length)] = allowed;
    }
  }
  return allow;
}

function withRequireDefaults(requireOptions = {}) {
  return Object.assign({}, requireOptions, {
    allow       : requireAllowWithUserOptions(requireOptions.allow),
    defaultAllow: requireOptions.defaultAllow ?? false
  });
}

function renderWithRetries(html) {
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      html.render();
      return;
    } catch (err) {
      if (!err.retry || attempt === 9) throw err;
    }
  }
}

function loadDynamicFonts(font) {
  const load = dynamic => {
    font.loadDynamicFileSync(dynamic);
    dynamic.setup(font);
  };
  Object.values(font.CLASS.dynamicFiles).forEach(load);
  for (const extension of font.CLASS.dynamicExtensions.values()) {
    Object.values(extension.files).forEach(load);
  }
}

module.exports = function(config) {

  //
  //  Create DOM adaptor and register it for HTML documents
  //
  const adaptor = new LiteAdaptor({
    fontSize        : 16,
    cjkCharWidth    : config.cjk_width,
    unknownCharWidth: config.normal_width
  });
  RegisterHTMLHandler(adaptor);
  const texConfig = {
    tags      : config.tags,
    inlineMath: config.single_dollars ? {
      '[+]': [['$', '$']]
    }: {},
  };
  const packages = addPackages(
    addPackages(appendPackages(config.packages), packagesForTags(config.tags)),
    needsConfigMacros(config.extension_options) ? ['configmacros'] : []
  );
  if (packages) {
    texConfig.packages = packages;
    loadTexPackages(packages);
  }
  Object.assign(texConfig, config.extension_options);
  if (needsRequireOptions(packages)) {
    texConfig.require = withRequireDefaults(texConfig.require);
  }

  return function(content) {

    //
    //  Create input and output jax and a document using them on the content from the HTML file
    //
    loadRequiredPackages(content);
    const tex = new TeX(texConfig);
    const svg = new SVG({
      fontCache    : 'none',
      fontData     : MathJaxNewcmFont,
      dynamicPrefix: '@mathjax/mathjax-newcm-font/cjs/svg/dynamic'
    });
    loadDynamicFonts(svg.font);
    const html = mathjax.document(content, {
      InputJax : tex,
      OutputJax: svg
    });

    //
    //  Typeset the document
    //
    renderWithRetries(html);

    //
    //  Output the resulting HTML
    //
    return adaptor.innerHTML(adaptor.body(html.document));
  };
};

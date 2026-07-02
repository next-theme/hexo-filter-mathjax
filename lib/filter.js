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
const { MathJaxMhchemFontExtension } = require('@mathjax/mathjax-mhchem-font-extension/cjs/svg.js');
const { source } = require('@mathjax/src/components/js/source.js');
const { dependencies, paths, provides } = require('@mathjax/src/components/js/dependencies.js');
const { Loader, CONFIG, MathJax } = require('@mathjax/src/js/components/loader.js');
const { Package } = require('@mathjax/src/js/components/package.js');
const { fileURLToPath } = require('node:url');

const texExtensions = Object.keys(source).filter(name => name.startsWith('[tex]/'));
const requireDisallow = new Set([
  'base',
  'autoload',
  'configmacros',
  'setoptions',
  'tagformat',
  'texhtml'
]);

function requirePath(name) {
  return require(typeof name === 'string' && name.startsWith('file:') ? fileURLToPath(name) : name);
}

CONFIG.require = requirePath;
Object.assign(CONFIG.source, source);
Object.assign(CONFIG.dependencies, dependencies);
Object.assign(CONFIG.paths, paths, {
  'mathjax-newcm'          : '@mathjax/mathjax-newcm-font/cjs',
  'mathjax-mhchem-extension': '@mathjax/mathjax-mhchem-font-extension/cjs'
});
Object.assign(CONFIG.provides, provides);
MathJax.config.startup = Object.assign({}, MathJax.config.startup, {
  output: 'svg'
});
Loader.saveVersion('[mathjax-mhchem-extension]/svg');

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

function loadTexPackages(packages) {
  const components = packageList(packages)
    .map(normalizeTexPackage)
    .filter(name => source[name]);
  return components.length ? Loader.load(...components) : Promise.resolve();
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

function defaultPackages(config) {
  return ['require', 'autoload']
    .concat(packagesForTags(config.tags))
    .concat(needsConfigMacros(config.extension_options) ? ['configmacros'] : []);
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

function useSynchronousAsyncLoad() {
  mathjax.asyncLoad = name => requirePath(Package.resolvePath(name));
  mathjax.asyncIsSynchronous = true;
}

function filter(config) {

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
  const packages = addPackages(appendPackages(config.packages), defaultPackages(config));
  if (packages) {
    texConfig.packages = packages;
  }
  Object.assign(texConfig, config.extension_options);
  texConfig.packages = addPackages(appendPackages(texConfig.packages), defaultPackages(config));
  texConfig.require = withRequireDefaults(texConfig.require);
  const ready = loadTexPackages(texConfig.packages);

  return async function(content) {

    //
    //  Create input and output jax and a document using them on the content from the HTML file
    //
    await ready;
    useSynchronousAsyncLoad();
    const tex = new TeX(texConfig);
    const svg = new SVG({
      fontCache    : 'none',
      fontData     : MathJaxNewcmFont,
      dynamicPrefix: '[mathjax-newcm]/svg/dynamic'
    });
    svg.font.addExtension(MathJaxMhchemFontExtension);
    svg.font.loadDynamicFilesSync();
    const html = mathjax.document(content, {
      InputJax : tex,
      OutputJax: svg
    });

    //
    //  Typeset the document
    //
    await html.renderPromise();

    //
    //  Output the resulting HTML
    //
    return adaptor.innerHTML(adaptor.body(html.document));
  };
}

module.exports = filter;
module.exports.requirePath = requirePath;

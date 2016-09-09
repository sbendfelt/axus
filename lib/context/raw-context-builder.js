const fs = require('fs');
const path = require('path');
const LibraryImporter = require('../import/lib-import/library-importer');
const CollectingWalker = require('../import/collecting-walker');
const ScriptCollector = require('../import/script-collector');
const DigestCollector = require('../import/digest-collector');

/**
 * Internal Builder class, allows us to defer the decision
 * around which providers and seed to use.
 */
class Builder {

  constructor() {
    this.resourceName = undefined;
    this.additionalContext = {};
    this.providersImpl = undefined;
    this.seedValue = undefined;
    this.root = null;
    this.libRoot = null;
  }

  fromRoot(root) {
    this.root = root;
    return this;
  }

  getRoot() {
    return this.root;
  }

  withLibrary(library) {
    this.libRoot = library;
    return this;
  }

  forNamedResource(resourceName) {
    this.resourceName = resourceName;
    return this;
  }

  addContext(additionalContext) {
    Object.assign(this.additionalContext, additionalContext);
    return this;
  }

  withProvidersImpl(providersImpl) {
    this.providersImpl = providersImpl;
    return this;
  }

  withLocalStore(store) {
    this.seedValue = store;
    return this;
  }

  withRestConfig(restConfig) {
    this.seedValue = restConfig;
    return this;
  }

  getLibImports(scripts) {
    return new LibraryImporter(libraryResolver()).getImportedScripts(scripts);
  }

  build() {
    const normalizedName = normalizeResourceName.call(this, this.resourceName);
    const {scripts, digests} = read(this.resourceName);
    const imports = this.getLibImports(scripts);
    const code = scripts
      .concat(imports)
      .join('\n');
    const sandbox = Object.assign({}, {
      Providers: this.providersImpl.seed(this.seedValue, digests || [])
    }, this.additionalContext || {});
    return {
      code: code,
      sandbox: sandbox
    };
  }
}

function normalizeResourceName(name) {
  return path.resolve(this.getRoot(), name);
}

function libraryResolver(rawBuilder) {
  return (name) => {
    return path.resolve(rawBuilder.libRoot, name);
  };
}

function read(name) {
  if (fs.lstatSync(name).isDirectory()) {
    return readModule(name);
  }
  return readFile(name);
}

function readModule(moduleName) {
  return new CollectingWalker()
    .withDefaultOptions()
    .withCollectors(new ScriptCollector(), new DigestCollector())
    .walk(moduleName);
}

function readFile(filename, errHandler) {
  try {
    return {
      'scripts': [fs.readFileSync(filename, 'utf-8')]
    };
  } catch (err) {
    if (errHandler) {
      errHandler(err);
    } else {
      throw err;
    }
  }
}

module.exports = Builder;

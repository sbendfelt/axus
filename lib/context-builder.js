const CollectingWalker = require('./import/collecting-walker');
const ScriptCollector = require('./import/script-collector');
const ConfigurationCollector = require('./import/configuration-collector');
const LibraryImporter = require('./import/lib-import/library-importer');
const Providers = require('./providers/providers');
const fs = require('fs');
const path = require('path');

/**
  * Static utilities. Uses an internal Builder to
  * construct the appropriate context.
  *
  */
const ContextBuilder = (function(module, undefined) {
  'use strict';

  let explicitRoot, explicitLib, instance;

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

    build() {
      const normalizedName = normalize(this.resourceName);
      const {
        scripts,
        configurations
      } = read(this.resourceName);
      const imports = getLibImports(scripts);
      const code = scripts
        .concat(imports)
        .join('\n');
      const sandbox = Object.assign({}, {
        Providers: this.providersImpl.seed(this.seedValue, configurations)
      }, this.additionalContext || {});
      return {
        code: code,
        sandbox: sandbox
      };
    }
  }

  function compose(root) {
    if (!fs.lstatSync(root).isDirectory) {
      root = path.dirname(root);
    }
    explicitRoot = root;
    return instance;
  }

  function overrideLib(newLib) {
    explicitLib = newLib;
    return instance;
  }

  function getRoot() {
    return explicitRoot || module.parent.filename;
  }

  function build(name, additionalContext) {
    const builder = new Builder()
      .forNamedResource(name)
      .addContext(additionalContext);
    return {
      forRest: (restConfig) => {
        return builder
          .withProvidersImpl(Providers.rest)
          .withRestConfig(restConfig)
          .build();
      },
      forLocal: (store) => {
        return builder
          .withProvidersImpl(Providers.local)
          .withLocalStore(store)
          .build();
      }
    };
  }

  function getLibImports(scripts) {
    new LibraryImporter(libNormalize).getImportedScripts(scripts);
  }

  function normalize(name) {
    return path.resolve(getRoot(), name);
  }

  function libNormalize(name) {
    if (explicitLib) {
      let lib = path.resolve(getRoot(), explicitLib, name);
      return lib;
    }
    return resolveStandardLib(name);
  }

  function resolveStandardLib(name) {
    let libRoot = path.join(getRoot(), '..', 'lib');
    return path.resolve(libRoot, name);
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
      .withCollectors(new ScriptCollector(), new ConfigurationCollector())
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

  instance = {
    compose: compose,
    overrideLib: overrideLib,
    build: build
  };

  return instance;
}());

module.exports = ContextBuilder;

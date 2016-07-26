const LibraryImporter = require('./import/library-importer');
const Providers = require('./providers/providers');

const ContextBuilder = (function(module, undefined) {
  'use strict';
  let fs, path, explicitRoot, explicitLib, instance, walk, xml2js;

  fs = require('fs');
  path = require('path');
  walk = require('walk');
  xml2js = require('xml2js');

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
    new LibraryImporter(libNormalize)
      .getImportedScripts();
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
    let scripts = [];
    let configurations = [];
    let options = {
      followLinks: false,
      filters: [
        'customUi',
        'PlatformLocalization',
        'TypeExtensionD1',
        'xsd'
      ],
      listeners: {
        file: (root, fileStats, next) => {
          if (fileStats.name.endsWith('.js')) {
            var resolvedJs = path.resolve(root, fileStats.name);
            var s = fs.readFileSync(resolvedJs, 'utf-8');
            scripts.push(s.trim());
          } else if (fileStats.name.endsWith('.xml')) {
            var resolvedXml = path.resolve(root, fileStats.name);
            new xml2js.Parser()
              .parseString(fs.readFileSync(resolvedXml, 'utf-8'), function(err, result) {
                configurations.push(result);
              });
          }
          next();
        },
        errors: (root, nodeStatsArray, next) => {
          //TODO
          next();
        }
      },
    };
    walk.walkSync(moduleName, options);
    if (!scripts.length) {
      throw new Error('Did not find any scripts in ' + moduleName);
    }
    return {
      'scripts': scripts,
      'configurations': configurations
    };
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

  instance = {
    compose: compose,
    overrideLib: overrideLib,
    build: build
  };

  return instance;
}());

module.exports = ContextBuilder;

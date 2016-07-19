let LibImport = require('./import/lib-import');

let appxRequire = (function(module, undefined) {
  "use strict";
  let fs, vm, path, explicitRoot, explicitLib, instance, walk;

  fs = require('fs');
  vm = require('vm');
  path = require('path');
  walk = require('walk');

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

  function load(name, context, callback) {
    name = normalize(name);
    let scripts = read(name);
    let imports = LibImport
      .scan(scripts)
      .map(libNormalize)
      .map((path) => {
        return readFile(path, (err) => {
          let importErr = new Error('Failed to find import.\n' + err.message);
          importErr.stack = err.stack;
          importErr.fileName = err.fileName;
          importErr.lineNumber = err.lineNumber;
          importErr.columnNumber = err.columnNumber;
          throw importErr;
        });
      });
    let uniScript = scripts
      .concat(imports)
      .join('\n');
    vm.runInNewContext(uniScript, context, 'appx-module'); //TODO get module name
    return context;
  }

  function normalize(name) {
    return path.resolve(getRoot(), name);
  }

  function libNormalize(name) {
    if(explicitLib) {
      let shit = path.resolve(getRoot(), explicitLib, name);
      return shit;
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
    return [readFile(name)];
  }

  function readModule(moduleName) {
    let scripts = [];
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
            var resolved = path.resolve(root, fileStats.name);
            var s = fs.readFileSync(resolved, 'utf-8');
            scripts.push(s.trim());
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
    return scripts;
  }

  function readFile(filename, errHandler) {
    try {
      return fs.readFileSync(filename, 'utf-8');
    } catch (err) {
      if(errHandler) {
        errHandler(err);
      } else {
          throw err;
      }
    }
  }

  instance = {
    compose: compose,
    overrideLib: overrideLib,
    require: load
  };

  return instance;
}());

module.exports = appxRequire;

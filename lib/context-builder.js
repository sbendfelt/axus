let LibImport = require('./import/lib-import');
let Providers = require('./providers/providers');
let contextBuilder = (function(module, undefined) {
    "use strict";
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

    function build(name, additionalContext, callback) {
        name = normalize(name);
        let contextBuilder = {};
        let resources = read(name);
        let scripts = resources.scripts || resources;
        let configurations = resources.configurations || [];
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
        return {
            forRest: function forRest(restConfig) {
                let ctx = {};
                let _ProvidersInstance = Providers.rest.seed(restConfig, configurations);
                Object.assign(ctx, {
                    Providers: _ProvidersInstance
                }, additionalContext || {});
                contextBuilder.uniScript = uniScript;
                contextBuilder.context = ctx;
                return contextBuilder;
            },
            forLocal: function forLocal(store) {
                let ctx = {};
                let _ProvidersInstance = Providers.local.seed(store, configurations);
                Object.assign(ctx, {
                    Providers: _ProvidersInstance
                }, additionalContext || {});
                contextBuilder.uniScript = uniScript;
                contextBuilder.context = ctx;
                return contextBuilder;
            }
        };
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
        return [readFile(name)];
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
                        new xml2js.Parser().parseString(fs.readFileSync(resolvedXml), function(err, result) {
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
            "scripts": scripts,
            "configurations": configurations
        };
    }

    function readFile(filename, errHandler) {
        try {
            return fs.readFileSync(filename, 'utf-8');
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

module.exports = contextBuilder;

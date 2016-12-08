const AppRootDir = require('app-root-dir').get();
const AppxRequire = require('./appx-require');
const ConnectionParamLoader = require('./connection-params');
const ContextBuilder = require('./context/context-builder');
const Defroster = require('./type/defroster');
const Providers = require('./providers/providers');
const Types = require('./type/types');
const v310Type = require('./type/v310-type');

function requireRest(resource, name, additionalContext) {
    const conf = ConnectionParamLoader.readConfig();
    const context = buildContextBase(resource, additionalContext)
        .useRest(conf)
        .build();
    return load(name, context);
}

function requireLocal(resource, name, additionalContext) {
    return {
        seed: (store) => {
            store = store || {};
            if (typeof store !== 'object') {
                throw new TypeError('Store must be an object!');
            }
            const context = buildContextBase(resource, additionalContext)
                .useLocal(store)
                .build();
            return load(name, context);
        }
    };
}

function buildContextBase(resource, additionalContext) {
    const builder = new ContextBuilder()
        .compose(AppRootDir)
        .forNamedResource(resource)
        .withAdditionalContext(additionalContext);
    if (Handles.explicitLib) {
        builder.overrideLib(Handles.explicitLib);
    }
    return builder;
}

function load(name, context) {
    const module = AppxRequire.require(context);
    if (name) {
        return module[name];
    }
    return module;
}

function registerV310Type(typeName, design, ...aliases) {
    const newType = new v310Type.Builder()
        .named(typeName)
        .withSchemaDesign(design)
        .withAliases(...aliases)
        .build();
    Types.getCacheInstance().register(newType);
    return Handles;
}

function overrideLib(newLib) {
    Handles.explicitLib = newLib;
    return Handles;
}

const Handles = {
    requireRest: requireRest,
    requireLocal: requireLocal,
    require: (p) => new Defroster().defrostPath(p),
    registerV310Type: registerV310Type,
    overrideLib: overrideLib
};

module.exports = Handles;

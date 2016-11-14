const fs = require('fs');
const path = require('path');
const ImmutableDefroster = require('../type/defroster');
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
        this.resourceName = null;
        this.additionalContext = {};
        this.providersImpl = null;
        this.seedValue = {};
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
        this.seedValue = store || {};
        return this;
    }

    withRestConfig(restConfig) {
        this.seedValue = restConfig;
        return this;
    }

    getLibImports(scripts) {
        return new LibraryImporter(libraryResolver())
            .getImportedScripts(scripts);
    }

    build() {
        const normalizedName = normalizeResourceName.call(this, this.resourceName);
        const {
            scripts,
            digests
        } = read(this.resourceName);
        const imports = this.getLibImports(scripts);
        const code = scripts
            .concat(imports)
            .join('\n');
        const sandbox = createSandbox.call(this, digests);
        return {
            code: code,
            sandbox: sandbox
        };
    }
}


/**
 * JS has trouble comparing across contexts.
 *
 * This is here to share the global core types, so that epxressions like
 * `date instanceof Date` will behave as expected whether called in the
 * modules source, or by the axus/mocha test-case.
 */
const globs = {
    Object: Object,
    Function: Function,
    Array: Array,
    Date: Date,
    JSON: JSON,
    Number: Number,
    String: String,
    RegExp: RegExp
};

function createSandbox(digests) {
    const providersVal = this
        .providersImpl.
    seed(defrostSeed(this.seedValue), digests || []);
    const providersSource = {
        Providers: providersVal
    };
    return Object.assign({},
        globs,
        providersSource,
        this.additionalContext || {});
}

function defrostSeed(seed) {
    const defroster = new ImmutableDefroster();
    return Object
        .keys(seed)
        .reduce((outerAcc, k) => {
            const child = seed[k];
            const childKeys = Object.keys(child);
            outerAcc[k] = childKeys.reduce((innerAcc, childKey) => {
                const entry = child[childKey];
                if (Array.isArray(entry)) {
                    innerAcc[childKey] = entry.map(defroster.defrost);
                } else {
                    innerAcc[childKey] = defroster.defrost(entry);
                }
                return innerAcc;
            }, {});
            return outerAcc;
        }, {});
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

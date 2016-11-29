const jsdocx = require('jsdoc-x');
const HelpRegistrar = require('./help-registrar');

const isDocumented =
    (doc) => !doc.undocumented || doc.undocumented !== true;

const isClassDef =
    (classname) =>
    (doc) =>
    doc.longname === classname && doc.kind === 'class';

class HelpEntryBuilder {

    static forAppXpress(sourcePath, className) {
      return new HelpEntryBuilder()
        .forSource(sourcePath)
        .asAClass(className)
        .includeKind('function');
    }

    constructor() {
        this.source = undefined;
        this.mustBeDocumented = true;
        this.memberof = undefined;
        this.kinds = [];
        this.filter = undefined;
    }

    forSource(source) {
        this.source = source;
        return this;
    }

    asAClass(className) {
        //TODO: class generator.
        this.isClass = true;
        this.mustBememberof(className);
        return this;
    }

    useFilter(filter) {
        this.filter = filter;
    }

    mustBememberof(name) {
        this.memberof = name;
        return this;
    }

    includeKind(kind) {
        this.kinds.push(kind);
        return this;
    }

    includeKinds(kinds) {
        this.kinds.push(...kinds);
        return this;
    }

    mustBeDocumented(mustBeDocumented) {
        this.mustBeDocumented = mustBeDocumented;
        return this;
    }

    build() {
        const docFilter = this.filter || createFilter.call(this);
        jsdocx
            .parse(this.source)
            .then((docs) => {
                docs.filter(docFilter)
                    .forEach((doc) => {
                        HelpRegistrar.register(doc.longname, doc);
                    });
            });
    }

    defer() {
        HelpRegistrar.defer(this);
    }

}

function createFilter() {
    const isClassDefinition = this.isClass && isClassDef(this.memberof);
    const filters = [];
    if (this.mustBeDocumented) {
        filters.push(isDocumented);
    }
    if (this.isClass) {
        filters.push((doc) => {
            return this.memberof === doc.memberof || isClassDefinition(doc);
        });
    } else if (this.memberof) {
        filters.push((doc) => {
            return this.memberof === doc.memberof;
        });
    }
    if (this.kinds.length) {
        filters.push((doc) => {
            if (this.isClass && isClassDef(doc)) {
                return true;
            }
            return this.kinds.includes(doc.kind);
        });
    }
    return (doc) => {
        for (let filter of filters) {
            if (!filter(doc)) {
                return false;
            }
        }
        return true;
    };
}

module.exports = HelpEntryBuilder;

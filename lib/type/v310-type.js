const Type = require('./type');
const Schema = require('./schema');

class v310Type extends Type {

    constructor(typeString, schema, ...aliases) {
        super(typeString, schema, ...aliases);
        this.apiVersion = '310';
        this.keyFunction = Type.v310KeyFunction;
    }

}

v310Type.Builder = class Builder {

    constructor() {
        this.name = null;
        this.schema = null;
        this.aliases = [];
    }

    named(name) {
        this.name = name;
        return this;
    }

    withSchemaDesign(schemaDesign) {
        this.schema = new Schema(schemaDesign);
        return this;
    }

    withSchema(schema) {
        this.schema = schema;
        return this;
    }

    withAlias(schema) {
        this.aliases.push(schema);
        return this;
    }

    withAliases(...aliases) {
        this.aliases = aliases;
        return this;
    }

    build() {
        const type = new v310Type(this.name, this.schema, ...this.aliases);
        this.schema.parent = type;
        return type;
    }

};

module.exports = v310Type;

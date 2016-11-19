/**
 * TYPES
 *
 * Types are said to be those defined by the public REST API.
 * A TypeCache holds all the known types. Types are aliasable.
 *
 * Types vary across apiVersion (v310, future 400). There are also Types defined
 * by GTNexus, as well as Custom Object's which may be defined by third parties.
 *
 * If a Type has been registered with a TypeCache, it will notify the TypeCache
 * when alias's are removed or added.
 */
class Type {

    constructor(typeString, schema, ...aliases) {
        if (this.constructor === Type) {
            throw new Error('Cannot instantiate Type class directly');
        }
        this.type = typeString;
        this.schema = schema;
        this.aliases = aliases;
        this.listeners = [];
    }

    addAlias(name) {
        const self = this;
        this.aliases.push(name);
        this.notify({
            eventName: 'aliasAdded',
            target: self,
            newAlias: name
        });
        return this;
    }

    removeAlias(name) {
        const self = this,
            idx = this.aliases.indexOf(name);
        if (idx === -1) {
            throw new Error(`No such alias ${name}`);
        }
        this.aliases.splice(idx, 1);
        this.notify({
            eventName: 'aliasRemoved',
            target: self,
            oldAlias: name
        });
    }

    getAliases() {
        return this.aliases.slice();
    }

    getKeys() {
        if (!this.keyFunction) {
            const tag = Object.prototype.toString.call(this);
            throw new Error(`${tag} does not implement a key function`);
        }
        return this
            .getNameAndAliases()
            .map(this.keyFunction);
    }

    getNameAndAliases() {
        return this
            .getAliases()
            .concat(this.type);
    }

    getSchema() {
      return this.schema;
    }

    getDesign() {
      return this.schema.getDesign();
    }

    getDataDictionary() {
      if(!this.schema) {
        throw new Error('no schema');
      }
      return this.schema.getDataDictionary();
    }

    getFieldData() {
      return this.schema.getFieldData();
    }

    addListener(listener) {
        this.listeners.push(listener);
        return this;
    }

    notify(event) {
        this.listeners.forEach((listener) => {
            listener.notify(event);
        });
    }

}

Type.keyFunction = function(apiVersion, typeOrAlias) {
    return `${apiVersion}__${typeOrAlias}`;
};

Type.v310KeyFunction = Type.keyFunction.bind(null, '310');

module.exports = Type;

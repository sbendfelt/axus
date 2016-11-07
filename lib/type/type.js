/**
 * TYPES
 * Core types are said to be those defined by the public v310 REST API.
 * A TypeCache holds all the known types.  Types are aliasable.
 *
 * If a Type has been registered with a TypeCache, it will notify the TypeCache
 * when alias's are removed or added.
 */
class Type {

    constructor(typeString, design, ...aliases) {
        this.type = typeString;
        this.design = design;
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
        return this.getAliases().concat(this.type);
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

module.exports = Type;

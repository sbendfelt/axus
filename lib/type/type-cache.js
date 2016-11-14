const Type = require('./type');
/**
 * Simple cache for registering unique types and their aliases.
 */
class TypeCache {

    constructor() {
        this.cache = {};
    }

    register(t) {
        const lCache = this.cache;
        t.getKeys().forEach((k) => {
            if (lCache[k]) {
                throw new Error(`Cannot add duplicate keys to the TypeCache (${k})`);
            }
            lCache[k] = t;
        });
        t.addListener(this);
    }

    evict(type) {
      const lCache = this.cache;
      type.getKeys().forEach((k) => {
        lCache[k] = null;
      });
    }

    evictAll() {
      this.cache = {};
    }

    registerAll(ts) {
        ts.forEach(this.register.bind(this));
        return this;
    }

    hasKey(key) {
      return this.cache[key] ? true : false;
    }

    get(...args) {
      let key;
      if(args.length == 2) {
        key = Type.keyFunction(args[0], args[1]);
      } else {
        key = args[0];
      }
      return this.cache[key];
    }

    notify(event) {
      if(event.eventName === 'aliasAdded') {
        if(this.cache[e.newAlias]) {
          throw new Error(`Cannot add duplicate keys to the TypeCache (${e.newAlias})`);
        }
        this.cache[e.newAlias] = event.target;
      } else if (event.eventName === 'aliasRemoved') {
        const entry = this.cache[event.oldAlias];
        if(entry && entry.type !== event.target.type) {
          throw new Error(`Type mismatch in cache. Couldn't remove ${e.oldAlias}`);
        }
        this.cache[k] = null;
      }

    }

}

module.exports = TypeCache;

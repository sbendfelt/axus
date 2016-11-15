const Type = require('./type');

/**
 * Simple cache for registering unique types and their aliases.
 */
class TypeCache {

    constructor() {
        this.cache = {};
        this.size = 0;
    }


    /**
     * register - register a single Type with the cache instance.
     *
     * @param  {type} t description
     * @return {type}   description
     */
    register(t) {
        const lCache = this.cache;
        t.getKeys().forEach((k) => {
            if (lCache[k]) {
                throw new Error(`Cannot add duplicate keys to the TypeCache (${k})`);
            }
            lCache[k] = t;
            this.size++;
        });
        t.addListener(this);
    }


    /**
     * evict - unregisters the Type from the cache instance
     *
     * @param  {type} type description
     * @return {type}      description
     */
    evict(type) {
        const lCache = this.cache;
        type.getKeys().forEach((k) => {
            if (lCache[k]) {
                lCache[k] = null;
                this.size--;
            }
        });
    }

    evictAll() {
        this.cache = {};
        this.size = 0;
    }

    registerAll(ts) {
        ts.forEach(this.register.bind(this));
        return this;
    }

    hasKey(key) {
        return this.cache[key] ? true : false;
    }


    /**
     * get - gets the Type from the cache if present.
     *
     * When two args are passed, they are expected in
     * apiVersion, typeString order.
     *
     * When one arg is passed, it is expected to be
     * the fully formed key.
     *
     * @param  {type} ...args description
     * @return {type}         description
     */
    get(...args) {
        let key;
        if (args.length == 2) {
            key = Type.keyFunction(args[0], args[1]);
        } else {
            key = args[0];
        }
        return this.cache[key];
    }


    /**
     * notify - called by Type instances. Used to alert the cache
     *          that underlying data is changing, and that it may
     *          need to restructure itself.
     *
     * @param  {type} event description
     * @return {type}       description
     */
    notify(event) {
        if (event.eventName === 'aliasAdded') {
            const {
                target,
                newAlias
            } = event;
            handleAliasAddedEvent.call(this, target, newAlias);
        } else if (event.eventName === 'aliasRemoved') {
            const {
                target,
                oldAlias
            } = event;
            handleAliasRemovedEvent.call(this, target, oldAlias);
        }
    }
}

function handleAliasAddedEvent(target, newAlias) {
    if (this.cache[newAlias]) {
        throw new Error(`Cannot add duplicate keys to the TypeCache (${newAlias})`);
    }
    const key = target.keyFunction(newAlias);
    this.cache[key] = target;
    this.size++;
}

function handleAliasRemovedEvent(target, oldAlias) {
    const key = target.keyFunction(oldAlias);
    const entry = this.cache[key];
    if (!entry) {
        throw new Error(`There is no entry present in cache for ${oldAlias}`);
    }
    if (entry && entry.type !== target.type) {
        throw new Error(`Type mismatch in cache. Couldn't remove ${oldAlias}`);
    }
    this.cache[key] = null;
    this.size--;
}

module.exports = TypeCache;

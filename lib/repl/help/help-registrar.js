class HelpRegistrar {

    constructor() {
        this.cache = {};
        this.deferrals = [];
    }

    register(name, docs) {
        this.cache[name] = docs;
    }

    getHelpEntry(name) {
        return this.cache[name];
    }

    getAllHelpEntries() {
      return this.cache;
    }

    /**
     * defer - Defers parsing of help, etc. Useful for instances
     *         when we don't need to generate help. For example, when only using
     *        axus a unit test dependency.
     *
     * @param  {type} builder description
     * @return {type}         description
     */
    defer(builder) {
        this.deferrals.push(builder);
    }

    processDeferrals() {
        this.deferrals.forEach((deferral) => deferral.build());
    }

}

//export the instance.
module.exports = new HelpRegistrar();

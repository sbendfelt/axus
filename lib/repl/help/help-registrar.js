const chalk = require('chalk');

const noHelpEntryFound = (key) => ({
    displayEntry: () =>
        console.log(chalk.red(`No documentation found for ${key}`))
});


/**
 * Responsible for keeping record of all help entries required
 * to be displayed at run time of the REPL.
 */
class HelpRegistrar {

    constructor() {
        this.cache = {};
        this.deferrals = [];
    }

    register(helpEntry) {
        this.cache[helpEntry.name] = helpEntry;
    }

    registerAll(helpEntries) {
        for (let entry of helpEntries) {
            this.register(entry);
        }
    }

    getHelpEntry(name) {
        return this.cache[name];
    }

    getAllHelpEntries() {
        return this.cache;
    }

    listEntries() {
        const allEntries = this.cache;
        Object.keys(allEntries)
            .sort()
            .forEach((key) => {
                if (allEntries[key].isForClass()) {
                    console.log(`${key}`);
                } else {
                    console.log(`\t${key}`);
                }
            });
    }

    displayEntry(key) {
        const entry = this.getHelpEntry(key) || noHelpEntryFound(key);
        entry.displayEntry();
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

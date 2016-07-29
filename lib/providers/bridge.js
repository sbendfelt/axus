const RestQuery = require('./query/restquery');
const LocalQuery = require('./query/localquery');
const RestFetchRequest = require('./fetch/rest-fetch-request');
const LocalFetchRequest = require('./fetch/local-fetch-request');
const ModuleDigest = require('../digest/module-digest.js');

class Bridge {
    constructor(seed, digests) {
        this.seed = seed;
        this.moduleDigest = new ModuleDigest(digests);
    }

    getSeed() {
        return this.seed;
    }

    getModuleDigest() {
        return this.moduleDigest;
    }

    newQuery(self, type, apiVersion) {
        if (this.seed.rest) {
            return new RestQuery(self, type, apiVersion);
        } else {
            return new LocalQuery(self, type, apiVersion);
        }
    }

    newFetchRequest(self, type, apiVersion, uid) {
        if (this.seed.rest) {
            return new RestFetchRequest(self, type, apiVersion, uid);
        } else {
            return new LocalFetchRequest(self, type, apiVersion, uid);
        }
    }
}

module.exports = Bridge;

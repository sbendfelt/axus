const RestQuery = require('./query/restquery');
const LocalQuery = require('./query/localquery');
const RestFetchRequest = require('./fetch/rest-fetch-request');
const LocalFetchRequest = require('./fetch/local-fetch-request');
const ModuleDigest = require('../digest/module-digest.js');

function *id(){
  let idx = 0;
  while(true){
        yield idx++;
  }
}

const idGen = id();

class Bridge {
  constructor(seed, digests) {
    if(!seed) {
      throw new Error('must have a seed');
    }
    this.id = idGen.next().value;
    this.seed = seed;
    this.moduleDigest = new ModuleDigest(digests);
  }

  getId() {
    return this.id;
  }

  getSeed() {
    return this.seed;
  }

  getModuleDigest() {
    return this.moduleDigest;
  }

  newQuery(type, apiVersion) {
    if (this.seed.rest) {
      return new RestQuery(this, type, apiVersion);
    } else {
      return new LocalQuery(this, type, apiVersion);
    }
  }

  newFetchRequest(type, apiVersion, uid) {
    if (this.seed.rest) {
      return new RestFetchRequest(this, type, apiVersion, uid);
    } else {
      return new LocalFetchRequest(this, type, apiVersion, uid);
    }
  }

  getStore() {
    if (this.seed.rest) {
      throw new Error('No store present for RESTful impl');
    }
    return this.seed.local;
  }

  getConfig() {
    if(this.seed.local) {
      throw new Error('No rest config present for Local impl');
    }
    return this.seed.rest;
  }
}

module.exports = Bridge;

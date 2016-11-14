const Query = require('./query');
const syncunirest = require('../../sync-unirest/sync-unirest');
const unirest = require('unirest');
const sync = require('synchronize');
const ImmutableDefroster = require('../../type/defroster');

class RestQuery extends Query {

  execute() {
    if(!this.oql) {
      throw new Error('Cannot query without oql!');
    }
    const appx = this.bridge.getConfig();
    if(!appx) {
      throw new Error('Illegal state could not resolve queryProvider REST config');
    }
    const req = unirest('GET',
       appx.url + this.apiVersion + '/' + this.type);
    req.query({
      'oql': this.oql,
      'dataKey': appx.dataKey
    });
    req.headers({
      'content-type': 'application/json',
    });
    req.auth({
      user: appx.username,
      pass: appx.password,
      sendImmediately: true
    });
    const result = sync.await(req.end(syncunirest.defer()));
    return new ImmutableDefroster().defrost(result);
  }
}

module.exports = RestQuery;

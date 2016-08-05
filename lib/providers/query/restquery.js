let Query = require('./query');
let syncunirest = require('../../sync-unirest/sync-unirest');
let unirest = require('unirest');
let sync = require('synchronize');

class RestQuery extends Query {

  execute() {
    if(!this.oql) {
      throw new Error('Cannot query without oql!');
    }
    let appx = this.bridge.getConfig();
    if(!appx) {
      throw new Error('Illegal state could not resolve queryProvider REST config');
    }
    let req = unirest('GET',
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
    let result;
    result = sync.await(req.end(syncunirest.defer()));
    return result;
  }
}

module.exports = RestQuery;

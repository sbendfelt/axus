let FetchRequest = require('./fetch-request');
let syncunirest = require('../../sync-unirest/sync-unirest');
let unirest = require('unirest');
let sync = require('synchronize');
let FetchRequestValidator = require('./fetch-request-validator');

class RestFetchRequest extends FetchRequest {
  execute() {
    let appx = this.bridge.getConfig();
    if(!appx) {
      throw new Error('Could not resolve parent provider config');
    }
    console.log('dafuq\n' + JSON.stringify(this));
    FetchRequestValidator.validate(this);
    console.log(`going to req w path ${pathFor(appx.url, this)} !!!`);
    const request = unirest('GET', pathFor(appx.url, this));
    request.query(this._params);
    request.query({
      dataKey: appx.dataKey
    });
    request.headers({
      'content-type': 'application/json',
    });
    request.auth({
      user: appx.username,
      pass: appx.password,
      sendImmediately: true
    });
    const result = sync.await(request.end(syncunirest.defer()));
    return result;
  }
}

function pathFor(root, request) {
  return `${root}${request._apiVersion}/${request.type}/${request._uid}`;
}

module.exports = RestFetchRequest;

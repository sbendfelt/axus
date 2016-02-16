let FetchRequest = require('./fetch-request');
let syncunirest = require('../../sync-unirest/sync-unirest');
let unirest = require('unirest');
let sync = require('synchronize');
let FetchRequestValidator = require('./fetch-request-validator');

class RestFetchRequest extends FetchRequest {
  execute() {
    let appx = this.parentProvider.config;
    if(!appx) {
      throw new Error('Could not resolve parent provider config');
    }
    FetchRequestValidator.validate(this);
    const request = unirest('GET', pathFor(appx.url, this));
    request.query(this.params);
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
  return `${root}${request.apiVersion}/${request.type}/${request.uid}`;
}

module.exports = RestFetchRequest;

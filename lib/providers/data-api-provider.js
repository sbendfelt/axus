const rRequest = require('./api/rest-script-engine-api-request');
const lRequest = require('./api/local-script-engine-api-request');

class DataApiProvider {

  constructor(seed) {
    this.Request = seed.rest ? rRequest : lRequest;
    this.store = seed.local || {};
    this.config = seed.rest;
    this.requests = [];
  }

  encode(value) {
    return encodeURIComponent(value);
  }

  /**
   * get :: string -> ScriptEngineApiRequest
   */
  get(pathInfo) {
    return new Request(pathInfo, this);
  }

  execute(request) {
    request.execute();
  }

  getScriptEngineApiRequests() {
    return this.requests.slice();
  }

  reset() {
    this.requests = [];
  }
}

module.exports = DataApiProvider;

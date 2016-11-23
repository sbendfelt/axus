const rRequest = require('./api/rest-script-engine-api-request');
const lRequest = require('./api/local-script-engine-api-request');

class DataApiProvider {

  constructor(bridge) {
    this.Request = bridge.isRest() ? rRequest : lRequest;
    // this.store = seed.local || {};
    // this.config = bridge.getConfig();
    this.requests = [];
  }
  encode(value) {
    return encodeURIComponent(value);
  }

  /**
   * get :: string -> ScriptEngineApiRequest
   */
  get(pathInfo) {
    return new this.Request(pathInfo, this);
  }

  execute(request) {
    return wrap(request.execute());
  }

  getScriptEngineApiRequests() {
    return this.requests.slice();
  }

  reset() {
    this.requests = [];
  }
}

function wrap(result) {
  if(!(Object.keys(result).length === 1 && result.data)) {
    result = {
      data: result
    };
  }
  return result;
}

module.exports = DataApiProvider;

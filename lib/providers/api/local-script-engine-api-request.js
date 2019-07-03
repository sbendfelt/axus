const ScriptEngineApiRequest = require('./script-engine-api-request');

class LocalScriptEngineApiRequest extends ScriptEngineApiRequest {

  execute() {
    if(!this.pathInfo) {
      throw new Error('Cannot execute without pathInfo!');
    }
    let store = this.parentProvider.bridge.getStore();
    let possibleMatches;
    if (!store || !(possibleMatches = store)) {
      return undefined;
    }
    let matchStatement = this.pathInfo;
    if (this.parameters) {
      Object.entries(this.parameters).forEach(function(entry, index) {
        if (index === 0) {
          matchStatement += '?'+entry[0]+'='+entry[1];
        } else {
          matchStatement += '&'+entry[0]+'='+entry[1];
        }
      });
    }
    return possibleMatches[matchStatement];
  }
}

module.exports = LocalScriptEngineApiRequest;

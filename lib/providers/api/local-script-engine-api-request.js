const ScriptEngineApiRequest = require('./script-engine-api-request');
const syncunirest = require('../../sync-unirest/sync-unirest');
const unirest = require('unirest');
const sync = require('synchronize');

class LocalScriptEngineApiRequest extends ScriptEngineApiRequest {

  execute() {
    throw new Error('unimplemented');
  }

}

module.exports = LocalScriptEngineApiRequest;

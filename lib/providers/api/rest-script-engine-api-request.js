const https = require('https');
const querystring = require('querystring');
const ScriptEngineApiRequest = require('./script-engine-api-request');

class RestScriptEngineApiRequest extends ScriptEngineApiRequest {

  async execute() {
    if(!this.pathInfo) {
      throw new Error('Cannot query without pathInfo');
    }
    const appxConfig = this.parentProvider.config;
    if(!appxConfig) {
      throw new Error('Missing AppX config');
    }
    return defaultRequest(this, appxConfig);
  }

}

function defaultRequest(restScriptEngineApiRequest, appxConfig) {
  const params = {...restScriptEngineApiRequest.parameters, dataKey: appxConfig.dataKey};
  const options = { headers: {... restScriptEngineApiRequest.headers,
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + Buffer.from(auth.username + ":" + auth.password).toString('base64')
  } };
  const cleanedUrl = buildRequestUrl(appxConfig.url, restScriptEngineApiRequest.pathInfo);
  const query = new querystring.stringify(params);

  return new Promise((resolve, reject) => {
    https.get(`${cleanedUrl}?${query}`, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (error) => {
      reject(`HTTP error! Status Code: ${error.stack ? error.stack : error}`);
    });
  });
}

function cleanUrl(url) {
  const idx = url.indexOf('/rest');
  return idx == -1 ? url : url.substring(0, idx);
}

function buildRequestUrl(base, path) {
  base = cleanUrl(base);
  if(!base.endsWith('/')) {
    base = base + '/';
  }
  return base + path;
}

module.exports = RestScriptEngineApiRequest;

let root = require('app-root-path').toString();
let fs = require('fs');

(function(module) {
  function readConfig() {
    let f = findConfig();
    let config = parseConfig(f);
    validateConfig(config);
    return config;
  }

  function findConfig() {
    let contents = fs.readdirSync(root);
    let conf = contents.find((f) => {
      return f === 'appx.json';
    });
    if (!conf) {
      throw new Error('Could not find appx.json file. ' +
        'Please check your project root.');
    }
    return conf;
  }

  function parseConfig(f) {
    try {
      return JSON.parse(fs.readFileSync(f));
    } catch (err) {
      console.log('Failed to read appx.json!');
      throw err;
    }
  }

  function validateConfig(conf) {
    let required = ['username', 'password', 'dataKey', 'url'];
    let missing = required.filter((item) => {
      return !(conf.hasOwnProperty(item) && conf[item]);
    });
    if (missing.length) {
      throw new Error('appx.config is missing the following:\n' +
        JSON.stringify(missing));
    }
  }

  module.exports = {
    readConfig: readConfig
  };
}(module));

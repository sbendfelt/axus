const root = require('app-root-path').toString();
const fs = require('fs');

class ConnectionParams {

    static readConfig() {
        const f = ConnectionParams.findConfig();
        const config = ConnectionParams.parseConfig(f);
        ConnectionParams.validate(config);
        return config;
    }

    static findConfig() {
        const contents = fs.readdirSync(root);
        const conf = contents.find((f) => {
            return f === 'appx.json';
        });
        if (!conf) {
            throw new Error('Could not find appx.json file. ' +
                'Please check your project root.');
        }
        return conf;
    }

    static parseConfig(f) {
        try {
            return JSON.parse(fs.readFileSync(f));
        } catch (err) {
            console.log('Failed to read appx.json!');
            throw err;
        }
    }

    static validate(conf) {
        const required = ['username', 'password', 'dataKey', 'url'];
        const missing = required.filter((item) => {
            return !(conf.hasOwnProperty(item) && conf[item]);
        });
        if (missing.length) {
            throw new Error('appx.config is missing the following:\n' +
                JSON.stringify(missing));
        }
    }
}

module.exports = ConnectionParams;

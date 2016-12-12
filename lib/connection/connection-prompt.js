const Streams = require('../stream/streams');
const readline = require('readline');

/**
 * ConnectionPrompt requires an Interface (as defined by node/readline).
 *
 * This allows the class to leverage a running repl's interface, or create
 * a new one to use on the fly (i.e. before REPL start up).
 *
 */
class ConnectionPrompt {

    static newPrompt(outstream) {
        let out = Streams.getMutableStream(outstream);
        return new ConnectionPrompt(readline.createInterface({
            input: process.stdin,
            output: out
        }));
    }

    constructor(iface) {
        this.iface = iface;
        this.closeIfaceOnCompletion = false;
        this._askName = askName.bind(this);
        this._askPassword = askPass.bind(this);
        this._askDataKey = askDataKey.bind(this);
        this._askEnv = askEnv.bind(this);
        this._doCloseStreamOnCompletion = closeOnCompletion.bind(this);
    }

    closeInterfaceOnCompletion() {
        this.closeIfaceOnCompletion = true;
        return this;
    }

    prompt() {
        if (!ifaceHasMutableOutStream(this.iface)) {
            throw new TypeError('Interface\'s output stream must be mutable.');
        }
        return this._askName()
            .then(this._askPassword)
            .then(this._askEnv)
            .then(this._askDataKey)
            .then(this._doCloseStreamOnCompletion);
    }

}

function ifaceHasMutableOutStream(iface) {
    return iface.output.mute && iface.output.unmute;
}

function askName() {
    return new Promise((resolve) => {
        this.iface.question('Username: ', (uname) => {
            resolve({
                username: uname
            });
        });
    });
}

function askPass(params) {
    return new Promise((resolve) => {
        const prompt = 'Password: ';
        this.iface.question(prompt, (pass) => {
            params.password = pass;
            this.iface.output.unmute();
            resolve(params);
        });
        this.iface.output.mute(prompt);
    });
}

function askDataKey(params) {
    return new Promise((resolve) => {
        this.iface.question('DataKey: ', (key) => {
            params.dataKey = key;
            resolve(params);
        });
    });
}

function askEnv(params) {
    return new Promise((resolve) => {
        this.iface.question('URL: ', (url) => {
            params.url = url;
            resolve(params);
        });
    });
}

function closeOnCompletion(params) {
    return new Promise((resolve) => {
        if (this.closeIfaceOnCompletion) {
            this.iface.close();
        }
        resolve(params);
    });
}

module.exports = ConnectionPrompt;

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
        this.closeOnCompletion = false;
        this._askName = askName.bind(this);
        this._askPassword = askPass.bind(this);
        this._askDataKey = askDataKey.bind(this);
        this._askEnv = askEnv.bind(this);
    }

    closeOutStreamOnCompletion() {
        this.closeOnCompletion = true;
        return this;
    }

    prompt() {
        if (!ifaceHasMutableOutStream(this.iface)) {
            throw new TypeError('Interface\'s output stream must be mutable.');
        }
        return this._askName()
            .then(this._askPassword);
            // .then(askEnv)
            // .then(askDataKey);
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
            if (this.closeOnCompletion) {
                // Streams.unpipe(this.iface.output);
                this.iface.output.end();
            }
            resolve(params);
        });
        this.iface.output.mute(prompt);
    });
}

function askDataKey(params) {

}

function askEnv(params) {

}

module.exports = ConnectionPrompt;

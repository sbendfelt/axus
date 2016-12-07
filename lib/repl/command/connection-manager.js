const readline = require('readline');
const stream = require('stream');
const Interface = require('readline').Interface;

const HELP = `print connection info, change credentials,etc...`;

const parser = require('yargs')
    .example('.connection -v', 'Prints the current connection params')
    .example('.connection --switch-profile', 'Select a connection profile')
    .option('v', {
        alias: 'verbose',
        nargs: 0,
        description: 'Print the current connection params'
    })
    .exitProcess(false)
    .help();

/**
 * Switching profile's most likely requires a change to the current appx.json
 * file, which currently only has one profile.
 *
 * 'cqa.gap-user' -->
 * {
 *  "cqa": {
 *    "gap-user" : {
 *      "user":...
 *     }
 *  }
 * }
 */
const ConnectionManagerCommand = (server) => {
    return {
        help: HELP,
        action: function(argv) {
            this.lineParser.reset();
            this.bufferedCommand = '';
            const foo = parseArgs(argv);
            if (foo.verbose) {
                console.log(JSON.stringify(server.connectionParams, undefined, 4));
                this.displayPrompt();
            } else {
                const getUsername = askName.bind(this);
                const getPassword = askPass.bind(this);
                const change = changeConnection.bind(this)(server);
                getUsername()
                    .then(getPassword)
                    .then(change)
                    .catch((err) => {
                        console.log(`Error occurred when switching connection.\n${err.message}`);
                        this.displayPrompt();
                    });
            }
        }
    };
};

function changeConnection(server) {
    const self = this;
    return (credentials) => {
        server.updateCredentials(credentials);
        console.log('update to displ ' + self);
        self.displayPrompt();
    };
}

function askName() {
    return new Promise((resolve) => {
        Interface.prototype.question.call(this, 'Username: ', (uname) => {
            resolve({
                username: uname
            });
        });
    });
}

function askPass(credentials) {
    return new Promise((resolve) => {
        Interface.prototype.question.call(this, 'Password: ', (pass) => {
            credentials.password = pass;
            resolve(credentials);
        });
    });
}

function parseArgs(argv) {
    const parsed = parser.parse(argv);
    return parsed;
}

module.exports = ConnectionManagerCommand;

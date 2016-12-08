const ConnectionParams = require('../../connection-params');
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
 *
 * At this time we only allow user to switch credentials, not whole profiles.
 */
const ConnectionManagerCommand = (server) => {

    function askName() {
        return new Promise((resolve) => {
            this.question('Username: ', (uname) => {
                resolve({
                    username: uname
                });
            });
        });
    }

    function askPass(params) {
        return new Promise((resolve) => {
            const prompt = 'Password: ';
            this.question(prompt, (pass) => {
                params.password = pass;
                server.unmute();
                resolve(params);
            });
            server.mute(prompt);
        });
    }

    function changeConnection(params) {
        ConnectionParams.validate(params);
        server.updateCredentials(params);
        this.displayPrompt();
    }

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
                //TODO: handle interupt (need to unmute?)
                const getUsername = askName.bind(this);
                const getPassword = askPass.bind(this);
                const change = changeConnection.bind(this);
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

function parseArgs(argv) {
    const parsed = parser.parse(argv);
    return parsed;
}

module.exports = ConnectionManagerCommand;

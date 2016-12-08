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
                const getPassword = askPass(server).bind(this);
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
    return (params) => {
        ConnectionParams.validate(params);
        server.updateCredentials(params);
        self.displayPrompt();
    };
}

function askName() {
    return new Promise((resolve) => {
      this.question('Username: ', (uname) => {
          resolve({
              username: uname
          });
      });
    });
}

function askPass(server) {
  return function(params) {
    return new Promise((resolve) => {
        const prompt = 'Password: ';
        this.question(prompt, (pass) => {
            params.password = pass;
            server.unmute();
            resolve(params);
        });
        server.mute(prompt);
    });
  };
}

function parseArgs(argv) {
    const parsed = parser.parse(argv);
    return parsed;
}

module.exports = ConnectionManagerCommand;

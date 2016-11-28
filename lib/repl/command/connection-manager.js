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
          if(foo.verbose) {
            console.log(JSON.stringify(server.connectionParams, undefined, 4));
          }
          this.displayPrompt();
        }
    };
};

function parseArgs(argv) {
  const parsed = parser.parse(argv);
  return parsed;
}

module.exports = ConnectionManagerCommand;

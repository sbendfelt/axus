const ContextBuilder = require('../../context/context-builder');
const vm = require('vm');

const HELP = `loads the appx module at the specified path.`;

const parser = require('yargs/yargs')(process.argv.slice(2))
    .example('.loadModule ~/modules/MyModule',
        'Loads the module at the path into the current REPL session.')
    .exitProcess(false)
    .help();

const LoadModuleCommand = (server) => {
    return {
        help: HELP,
        action: function(argv) {
            this.lineParser.reset();
            this.bufferedCommand = '';
            const parsed = parseArgs(argv);
            if (parsed.help) {
                this.displayPrompt();
                return;
            }
            if (!parsed.isValid) {
              usage.call(this, parsed.validationMsg);
              return;
            }
            const path = parsed.path;
            putScope.call(this, server, path);
            this.displayPrompt();
        }
    };
};

function putScope(server, pathToScope) {
  const appxContext = new ContextBuilder()
      .forNamedResource(pathToScope)
      .build();
  const code = appxContext.getCode();
  if (!code) {
      usage.call(this, `No code found at ${path}`);
      return;
  }
  const digests = appxContext.getDigests();
  const script = vm.createScript(code);
  const sandbox = {};
  script.runInNewContext(sandbox);
  server.putAppXScope(sandbox, digests);
}

function parseArgs(argv) {
    const parsed = parser.parse(argv);
    parsed.isValid = true;
    const path = parsed._;
    parsed.path = path;
    if (!path || !path.length) {
        parsed.isValid = false;
        parsed.validationMsg = `Hmmm...${path} doesn't look like a path`;
    } else if (Array.isArray(path)) {
        if (path.length > 1) {
            parsed.isValid = false;
            parsed.validationMsg = 'Please specify only one module';
        } else {
            parsed.path = path[0];
        }
    }
    return parsed;
}

function usage(msg) {
    if (!msg) {
        msg = HELP;
    }
    console.log(msg);
    this.displayPrompt();
}

module.exports = LoadModuleCommand;

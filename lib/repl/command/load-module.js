const ContextBuilder = require('../../context/context-builder');
const vm = require('vm');

const HELP = `loads the appx module at the specified path.`;

const LoadModuleCommand = (server) => {
    return {
        help: HELP,
        action: function(path) {
            this.lineParser.reset();
            this.bufferedCommand = '';
            if (!path) {
                usage.call(this, `Hmmm...${path} doesn't look like a path`);
                return;
            }
            const appxContext = new ContextBuilder()
                .forNamedResource(path)
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
            this.displayPrompt();
        }
    };
};

function usage(msg) {
    if (!msg) {
        msg = HELP;
    }
    console.log(msg);
    this.displayPrompt();
}

module.exports = LoadModuleCommand;

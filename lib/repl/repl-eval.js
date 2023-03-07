const vm = require('vm');
const Recoverable = require('repl').Recoverable;
const TypeChecker = require('../type/js-type-checker');

/**
 * ord = Providers.getPersistenceProvider().createFetchRequest('OrderDetail', 310, '436428526').execute()
 */
class ReplEval {

    static createEval(server) {
        const instance = new ReplEval(server);
        return function(code, context, file, callback) {
            if (code === '\n') {
                return callback(null);
            }
            instance.commands.push({
                code: code,
                context: context,
                file: file,
                callback: callback
            });
            instance.next();
        };
    }

    constructor(server) {
        this.server = server;
        this.timeout = {};
        this.commands = [];
    }

    //EH - note that this is where the code is executed line-by-line, however this could be done better today using just a Promise
    next() {
        (async () => {
            const toProcess = this.commands.shift();
            let result, err;
            if (toProcess) {
                try {
                    const script = createScript(toProcess);
                    const scriptOptions = {
                        displayErrors: true
                    };
                    result = await script.runInContext(toProcess.context, scriptOptions);
                } catch (e) {
                    if(isRecoverable(e)) {
                      return toProcess.callback(new Recoverable(e));
                    }
                    result = undefined; //TODO: some errors are recoverable.
                    err = e;
                }
                await toProcess.callback(err, result);
                this.next();
            }
        })();
    }
}

function isRecoverable(e) {
    return e.name === 'SyntaxError' ?
        /^(Unexpected end of input|Unexpected token)/.test(e.message) :
        false;
}

function createScript(toProcess) {
    return vm.Script(toProcess.code, { //updated in Node.js > 0.12
        filename: toProcess.file,
        displayErrors: true
    });
}

module.exports = ReplEval;

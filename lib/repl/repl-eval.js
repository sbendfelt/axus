const vm = require('vm');
const TypeChecker = require('../type/js-type-checker');
const sync = require('synchronize');


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

    next() {
        sync.fiber(() => {
            const toProcess = this.commands.shift();
            let result, err;
            if (toProcess) {
                this.fireNext = false;
                try {
                    const script = createScript(toProcess);
                    const scriptOptions = {
                        displayErrors: true
                    };
                    result = script.runInContext(toProcess.context, scriptOptions);
                } catch (e) {
                    result = undefined; //TODO: some errors are recoverable.
                    err = e;
                }
                toProcess.callback(err, result);
                this.next();
            }
        });
    }
}

function createScript(toProcess) {
    return vm.createScript(toProcess.code, {
        filename: toProcess.file,
        displayErrors: true
    });
}

module.exports = ReplEval;

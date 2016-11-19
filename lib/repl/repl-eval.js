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
            //TODO: replace w bind,
            //and move.
            if(code === '\n') {
              return callback(null);
            }
            instance.commands.push({
                code: code,
                context: context,
                file: file,
                callback: callback
            });
            if (instance.fireNext) {
                instance.next();
            }
        };
    }

    constructor(server) {
        this.server = server;
        this.fireNext = true;
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
                  //breakOnSigInt:
                };
                result = script.runInContext(toProcess.context, scriptOptions); //toProcess.file);
                if (result && TypeChecker.isPromise(result)) {
                    toProcess.isAsync = true;
                    result.then((response) => {
                        toProcess.processed = true;
                        //we need to hanle assignment.
                        //we end up with x = promise
                        //the callback returns the value correctly,
                        //but doesnt change what we bound
                        //allternately, we can wrapt script in sync,
                        //and dont use async
                        toProcess.callback(undefined, response);
                        this.next();
                    }, (err) => {
                        toProcess.processed = true;
                        toProcess.callback(err);
                        this.next();
                    });
                }
            } catch (e) {
                result = undefined; //TODO: some errors are recoverable.
                err = e;
            }
            if (!toProcess.isAsync) {
                toProcess.callback(err, result);
                this.next();
            }
        } else {
            this.fireNext = true;
        }
      });
    }
}

function wrap(code) {
  return `sync.fiber(() => {${code}})`;
}

function createScript(toProcess) {
  return vm.createScript(toProcess.code, {
    filename: toProcess.file,
    displayErrors: true
  });
}

module.exports = ReplEval;

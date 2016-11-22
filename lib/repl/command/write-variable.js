const fs = require('fs');

const circular = /^Converting circular structure to JSON/;

const HELP = `.writeVar <var> <path>
writes the JSON representation of the var to the specified path`;

const WriteVariable = (server) => {
    return {
        help: HELP,
        action: function(parm) {
            const [variable, path, ...rest] = parm.split(/\s+/);
            this.lineParser.reset();
            this.bufferedCommand = '';
            if (!variable) {
                usage.call(this, 'No var specified');
                return;
            }
            if(!path) {
              console.log('No destination path passed. Defaulting to...');
            }
            const value = server.getFromContext(variable);
            if (!value) {
                console.log(`Failed to find ${variable} in this context. Are you sure you spelled it correctly?`);
            } else {
              console.log(`We have path: ${path}`);
            }
            tryWrite.call(this, variable, value, path);
            // this.displayPrompt();
        }
    };
};

//TODO: all commands are going to use this, lets pull it up.
function usage(msg) {
    if (!msg) {
        msg = HELP;
    }
    console.log(msg);
    this.displayPrompt();
}

function tryWrite(name, val, path) {
    try {
        const json = JSON.stringify(val, null, 4);
        fs.writeFile(path, json, 'utf-8', (err) => {
            if (err) {
                console.log('Couldnt write the file!', err);
            }
            this.displayPrompt();
        });
    } catch (e) {
      if(circular.test(e)) {
        console.log('Circular references detected. Cannot write JSON to file.');
      } else {
        console.log(e);
      }
      this.displayPrompt();
    }
}

module.exports = WriteVariable;

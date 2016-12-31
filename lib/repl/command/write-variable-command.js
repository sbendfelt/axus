const fs = require('fs');
const path = require('path');
const FileUtils = require('../../file/utils');

const HELP = `writes a JSON representation of a variable to disk`;

const parser = require('yargs/yargs')(process.argv.slice(2))
    .example('.writeVariable foo --path ~/Desktop/foo.json',
        'Writes the stringified version of foo to a file named foo on your desktop.')
    .option('p', {
        alias: 'path',
        nargs: 1,
        default: '/Users/jdonovan1/Desktop/',
        description: 'Specifies the path to write the variable to'
    })
    .exitProcess(false)
    .help();

const circular = /^Converting circular structure to JSON/;

const WriteVariable = (server) => {
    return {
        help: HELP,
        action: function(argv) {
            this.lineParser.reset();
            this.bufferedCommand = '';
            const args = parseArgs(argv);
            if(!args) {
              this.displayPrompt();
              return;
            }
            const {
                error,
                variable,
                targetPath
            } = args;
            if (error) {
                usage.call(this, error);
                return;
            }
            const value = server.getFromContext(variable);
            if (!value) {
                console.log(`Failed to find ${variable} in this context. Are you sure you spelled it correctly?`);
                return;
            }
            tryWrite.call(this, variable, value, targetPath);
        }
    };
};

function parseArgs(argv) {
    const parsed = parser.parse(argv);
    if(parsed.help) {
      return null;
    }
    const vars = parsed._;
    if (!vars.length || vars.length > 1) {
        return {
            error: `Please specify one variable to write at a time`
        };
    }
    return {
        variable: vars[0],
        targetPath: parsed.path
    };
}

function usage(msg) {
    console.log(msg);
    // parser.showHelp();
    this.displayPrompt();
}

function tryWrite(name, val, targetPath) {
    const fullTargetPath = expandPath(targetPath);
    try {
        const json = JSON.stringify(val, null, 4);
        fs.writeFile(path.resolve(targetPath), json, 'utf-8', (err) => {
            if (err) {
                console.log('Couldnt write the file!', err);
            }
            this.displayPrompt();
        });
    } catch (e) {
        if (circular.test(e)) {
            console.log('Circular references detected. Cannot write JSON to file.');
        } else {
            console.log(e);
        }
        this.displayPrompt();
    }
}

function expandPath(targetPath, name) {
    const newTarget = FileUtils.expand(targetPath);
    const stats = fs.lstatSync(targetPath);
    if (stats.isDirectory()) {
        return path.join(newTarget, `${name}.json`);
    }
    return newTarget;
}

module.exports = WriteVariable;

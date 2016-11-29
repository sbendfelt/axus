const chalk = require('chalk');
const HelpRegistrar = require('../help/help-registrar');

function makeHeader(str) {
    const l = (process.stdout.columns - str.length) / 2;
    const spacer = ' '.repeat(l);
    return spacer + str + spacer;
}

function displayEntry(arg) {
    const doc = HelpRegistrar.getHelpEntry(arg);
    if(!doc) {
      console.log(chalk.red(`No documentation found for ${arg}`));
      return;
    }
    switch (doc.kind) {
        case 'class':
            displayClass(doc);
            break;
        case 'function':
            displayFunction(doc);
            break;
        default:
            break;
    }
}

function displayClass(doc) {
    const blocks = [];
    blocks.push(chalk.black.bgYellow(makeHeader(doc.longname)));
    blocks.push('');
    blocks.push(doc.classdesc);
    blocks.push('');
    console.log(blocks.join('\n'));
}

function displayFunction(doc) {
    const blocks = [];
    blocks.push(chalk.black.bgYellow(makeHeader(doc.longname)));
    blocks.push('');
    blocks.push(doc.description);
    if (doc.params.length) {
        blocks.push('');
        blocks.push('Arguments');
        doc.params.forEach((param) => {
            const subBlock = [];
            subBlock.push(chalk.blue(`${param.name} (${param.type.names.join(', ')}):`));
            subBlock.push(param.description);
            blocks.push(subBlock.join('\t'));
        });
    }
    if (doc.returns.length) {
        blocks.push('');
        blocks.push('Returns');
        doc.returns.forEach((ret) => {
            const subBlock = [];
            subBlock.push(chalk.blue(`(${ret.type.names.join(', ')}):`));
            subBlock.push(ret.description);
            blocks.push(subBlock.join('\t'));
        });
    }
    blocks.push('');
    console.log(blocks.join('\n'));
}

function listEntries() {
  const allEntries = HelpRegistrar.getAllHelpEntries();
  Object.keys(allEntries)
      .sort()
      .forEach((key) => {
          if (allEntries[key].kind === 'class') {
              console.log(`• ${key}`);
          } else {
              console.log(`--> ${key}`);
          }
      });
}

exports.displayEntry = displayEntry;
exports.listEntries = listEntries;

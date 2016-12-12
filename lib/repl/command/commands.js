const ConnectionManagerCommand = require('./connection-manager-command');
const HelpCommand = require('./help-command');
const LoadModuleCommand = require('./load-module-command');
const WriteVariableCommand = require('./write-variable-command');

exports.registerStandardCommands = function registerStandardCommands() {
    this.replServer.defineCommand('loadModule', LoadModuleCommand(this));
    this.replServer.defineCommand('writeVariable', WriteVariableCommand(this));
    this.replServer.defineCommand('connection', ConnectionManagerCommand(this));
    this.replServer.defineCommand('h', HelpCommand(this));
};

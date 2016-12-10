const ConnectionManagerCommand = require('./connection-manager');
const HelpCommand = require('./help-command');
const LoadModuleCommand = require('./load-module');
const WriteVariableCommand = require('./write-variable');

exports.registerStandardCommands = function registerStandardCommands() {
    this.replServer.defineCommand('loadModule', LoadModuleCommand(this));
    this.replServer.defineCommand('writeVariable', WriteVariableCommand(this));
    this.replServer.defineCommand('connection', ConnectionManagerCommand(this));
    this.replServer.defineCommand('h', HelpCommand(this));
};

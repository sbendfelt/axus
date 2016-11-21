const AppXReplServer = require('./repl/appx-repl-server');

new AppXReplServer()
    .useDefaultConfig()
    .useDefaultProviders()
    .start();

const AppXReplServer = require('./repl/appx-repl-server');

new AppXReplServer()
    .defaultConfig()
    .withDefaultProviders()
    .start();

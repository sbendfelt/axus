var chalk = require('chalk');
var cli = require('commander');
var fs = require('fs');
var sync = require('synchronize');
var vm = require('vm');
//
var Providers = require('./providers/providers');
var print = require('./prettyPrint');

/**
 * Harness
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
var Harness = (function() {

  var cnt;

  var sandbox = {
    console: console,
    prettyjson: require('prettyjson'),
    Providers: Providers,
    sank: sync,
    finish: () => {
      if (--cnt === 0) {
        playback();
      }
    }
  };

  function run(tests) {
    if (Array.isArray(tests)) {
      cnt = tests.length;
    } else {
      cnt = 1;
    }
    preamble();
    tests.map((t) => {
      return './tests/' + t + '.js';
    }).forEach((t) => {
      var test = wrapInSync(fs.readFileSync(t, 'utf8'));
      vm.runInNewContext(test, sandbox);
    });
  }

  function preamble() {
    console.log(print.repeat('*', chalk.magenta));
    console.log(print.centered('APPX TEST HARNESS',
      chalk.magenta));
    console.log(print.repeat('*', chalk.magenta));
  }

  function playback() {
    console.log('Run Stats:');
    var queriesCreated = Providers
      .getQueryProvider()
      .getQueries();
    console.log('\t' + chalk.green('\u2713 ') +
      queriesCreated.length +
      ' queries created');
  }

  function wrapInSync(test) {
    return 'sank.fiber(() => {' +
      test + 'finish();' +
      '});';
  }

  return {
    run: run
  };
}());

/**
 *
 */
cli
  .version('0.0.1');
cli
  .command('test [tests...]')
  .description('RUN ALL THE TESTS!')
  .action((tests) => {
    console.log('Running Tests for:\n' + JSON.stringify(tests, null, 2));
    Harness.run(tests);
  });

if (process.argv.slice(2).length === 0) {
  cli.outputHelp();
  return;
}

cli.parse(process.argv);

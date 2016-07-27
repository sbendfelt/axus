const DEFAULT_FILTERS = [
  'customUi',
  'PlatformLocalization',
  'TypeExtensionD1',
  'xsd'
];

const DEFAULT_WALK_OPTIONS = {
  followLinks: false,
  filters: DEFAULT_FILTERS,
  listeners: {}
};

const _walk = require('walk');

class CollectingWalker {

  constructor() {
    this.walkOptions = {};
    this.collectors = [];
  }

  withOptions(options) {
    this.walkOptions = options;
    return this;
  }

  withDefaultOptions() {
    this.walkOptions = DEFAULT_WALK_OPTIONS;
    return this;
  }

  withDefaultFilters() {
    this.walkOptions.filters = DEFAULT_FILTERS;
    return this;
  }

  withFilters() {
    const filters = Array.prototype.slice.call(arguments);
    this.walkOptions.filters = filters;
    return this;
  }

  withCollectors() {
    const collectors = Array.prototype.slice.call(arguments);
    assertUniqueNames(collectors);
    this.collectors = collectors;
    return this;
  }

  walk(moduleName) {
    const localOpts = Object.assign({}, this.walkOptions);
    localOpts.listeners = {
      file: (root, fileStats, next) => {
        const scenario = {
          'root': root,
          'fileStats': fileStats,
          'next': next
        };
        this.collectors.forEach((collector) => {
          if (collector.when(scenario)) {
            collector.thenCollect(scenario);
          }
        });
        next();
      },
      error: (root, nodeStatsArray, next) => {
        next(); //TODO
      }
    };
    _walk.walkSync(moduleName, localOpts);
    return getCollectionMap(this.collectors);
  }

}

function assertUniqueNames(collectors) {
  const seed = {
    foundKeys: {},
    dupes: []
  };
  const uniq = collectors.reduce((previous, next) => {
    const name = next.getCollectionName();
    console.log(`What we have here -> \n${JSON.stringify(previous)}`);
    if (!previous.foundKeys[next.getCollectionName()]) {
      previous.foundKeys[next.getCollectionName()] = next;
    } else {
      previous.dupes.push(name);
    }
    return previous;
  }, seed);
  if (uniq.dupes.length) {
    throw new Error(`
      Collector names must be unique.
      The following duplicates were detected:\n${uniq.dupes.join(", ")}`);
  }
}

function getCollectionMap(collectors) {
  return collectors.reduce((prev, next) => {
    prev[next.getCollectionName()] = next.getCollection();
    return prev;
  }, {});

}

module.exports = CollectingWalker;

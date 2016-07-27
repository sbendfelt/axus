const path = require('path');
const fs = require('fs');

class ScriptCollector {

  constructor() {
    this.collection = [];
  }

  getCollectionName() {
    return 'scripts';
  }

  getCollection() {
    return this.collection;
  }

  when(scenario) {
    return scenario.fileStats.name.endsWith('.js');
  }

  thenCollect(scenario) {
    const resolvedJs = path.resolve(scenario.root, scenario.fileStats.name);
    const s = fs.readFileSync(resolvedJs, 'utf-8');
    this.collection.push(s.trim());
  }

}

module.exports = ScriptCollector;

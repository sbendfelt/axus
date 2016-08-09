const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

class DigestCollector {

  constructor() {
    this.collection = [];
  }

  getCollectionName() {
    return 'digests';
  }

  getCollection() {
    return this.collection;
  }

  when(scenario) {
    return scenario.fileStats.name.endsWith('.xml');
  }

  thenCollect(scenario) {
    const resolvedXml = path.resolve(scenario.root, scenario.fileStats.name);
    const config = fs.readFileSync(resolvedXml, 'utf-8');
    const self = this;
    new xml2js.Parser().parseString(config, function(err, result) {
      self.collection.push(result);
    });
  }
}

module.exports = DigestCollector;

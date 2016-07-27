const path = require('path');
const xml2js = require('xml2js');

class ConfigurationCollector {

  constructor() {
    this.collection = [];
    this.xmlParser  = new xml2js.Parser();
  }

  getCollectionName() {
    return 'configurations';
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
    xmlParser.parseString(config, function(err, result) {
      this.collection.push(result);
    });
  }

}

module.exports = ConfigurationCollector;

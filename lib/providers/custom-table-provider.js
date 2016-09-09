const MatchBuilder = require('./custom-table/match-builder');

class CustomTableProvider {
  constructor(bridge) {
    this.bridge = bridge;
    this.fetches = [];
  }

  lookup(globalObjectType, linkFieldNameForRow, oql) {
    return new MatchBuilder(this, globalObjectType, linkFieldNameForRow)
      .withOql(oql)
      .execute();
  }

  matchLookup(globalObjectType, linkFieldNameForRow) {
    return new MatchBuilder(this, globalObjectType, linkFieldNameForRow);
  }

  reset() {
    this.fetches = [];
  }
}

module.exports = CustomTableProvider;

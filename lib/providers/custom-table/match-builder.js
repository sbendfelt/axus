class MatchBuilder {

  constructor(parentProvider, globalObjectType, linkFieldNameForRow) {
    this.parentProvider = parentProvider;
    this.bridge = parentProvider.bridge;
    this.globalObjectType = globalObjectType;
    this.linkFieldNameForRow = linkFieldNameForRow;
    this.mandatoryOql = {};
    this.optionalMatches = [];
  }

  withOql(mandatoryOql) {
    this.mandatoryOql = mandatoryOql;
    return this;
  }

  optionalMatch(optionalMatchOql, matchColumn) {
    this.optionalMatches.push(`${optionalMatchOql},${matchColumn}`);
    return this;
  }

  execute() {
    if (this.bridge.isRest()) {
      throw new Error(`Unsupported Operation:
        Restful CustomTableProvider is not yet implemented.
        Please use Local`);
    }
    const moduleDigest = this.bridge.getModuleDigestForType(this.globalObjectType);
    if(!moduleDigest) {
      throw new Error('No digest found for ${this.globalObjectType}');
    }
    const workflowFeature = moduleDigest.getCustomObjectDesignWorkflowFeature(this.globalObjectType);
    if (!moduleDigest || !workflowFeature) { //this check is a little confusing.
                                             //what we really care about is that there is
                                             //workflow and that we can find the status field.
      return [];
    }
    let tableInstances = retrieveTableInstances.call(this, moduleDigest);
    return findMatchingInstance.call(this, tableInstances);
  }
}

function retrieveTableInstances(moduleDigest) {
  const businessStatusField = moduleDigest
    .getCustomObjectDesignWorkflowFeature(this.globalObjectType)
    .businessStatusField[0];
  const apiVersion = moduleDigest.getCustomObjectDesignApiVersion(this.globalObjectType);
  const topLevelOql = `${businessStatusField} = 'Active'`;
  const queryResult = this.bridge.newQuery(this.globalObjectType, apiVersion)
    .setOQL(topLevelOql)
    .execute();
  return queryResult.result ? queryResult.result : [];
}

function findMatchingInstance(tableInstances) {

  let result,
    optionalOql,
    oqlSearchCriteria;
  if (!tableInstances.length) {
    return [];
  }
  optionalOql = this.optionalMatches.join(':');
  oqlSearchCriteria = [this.mandatoryOql, optionalOql].join('');
  result = tableInstances.find((resultTypeEntry) => {
    return resultTypeEntry[this.linkFieldNameForRow];
  });
  console.log(`Looking for match for ${this.linkFieldNameForRow} -> ${oqlSearchCriteria}`);
  return (result && result[this.linkFieldNameForRow][oqlSearchCriteria]) || [];
}

module.exports = MatchBuilder;

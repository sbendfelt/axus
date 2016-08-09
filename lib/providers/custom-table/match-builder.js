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
        this.optionalMatches.push([optionalMatchOql, matchColumn].join(','));
        return this;
    }

    execute() {
        // Opt out if context is Rest Based, it is not yet supported.
        if (this.bridge.assertRest()) {
            throw new Error("Unsupported Operation: Restful CustomTableProvider is not yet implemented. Please use Local");
        } else {
            try {
                let moduleDigest = this.bridge.getModuleDigest();
                if (moduleDigest) {
                    let businessStatusField = moduleDigest.getCustomObjectDesignWorkflowFeature(this.globalObjectType).businessStatusField[0];
                    let apiVersion = moduleDigest.getCustomObjectDesignApiVersion(this.globalObjectType);
                    let topLevelOql = [businessStatusField, " = 'Active'"].join('');
                    let optionalOql = this.optionalMatches.join(':');
                    let oqlSearchCriteria = [this.mandatoryOql, optionalOql].join(''); // TODO We need a good way to concat Optional match statements in the store. This solution uses one approach which supports both lookup and matchLookup

                    let tableQuery = this.bridge.newQuery(this.globalObjectType, apiVersion).setOQL(topLevelOql).execute();
                    if (tableQuery.result && tableQuery.result.length) {
                        let result = tableQuery.result.find((resultTypeEntry)=> { //TODO Ugly, but once we find what we are looking for we still need to unwrap the entries object.
                            return resultTypeEntry[this.linkFieldNameForRow];
                          });
                        if (result) {
                          return (result && result[this.linkFieldNameForRow][oqlSearchCriteria]) || [];
                        }
                    }
                }
            } catch (err) {
                throw err;
            }
        }
    }
}
module.exports = MatchBuilder;

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
            let result;
            let oqlSearchCriteria;
            try {



                let moduleDigest = this.bridge.getModuleDigest();
                if (moduleDigest) {
                    let workflowFeature = moduleDigest.getCustomObjectDesignWorkflowFeature(this.globalObjectType);
                    if (workflowFeature) {
                        let businessStatusField = moduleDigest.getCustomObjectDesignWorkflowFeature(this.globalObjectType).businessStatusField[0];
                        let apiVersion = moduleDigest.getCustomObjectDesignApiVersion(this.globalObjectType);
                        let topLevelOql = [businessStatusField, " = 'Active'"].join('');
                        let tableQuery = this.bridge.newQuery(this.globalObjectType, apiVersion).setOQL(topLevelOql).execute();

                        if (tableQuery.result && tableQuery.result.length) {
                            let optionalOql = this.optionalMatches.join(':');
                            oqlSearchCriteria = [this.mandatoryOql, optionalOql].join('');
                            result = tableQuery.result.find((resultTypeEntry) => {
                                return resultTypeEntry[this.linkFieldNameForRow];
                            });
                        }
                    }
                }
                return (result && result[this.linkFieldNameForRow][oqlSearchCriteria]) || [];
            } catch (err) {
                throw err;
            }
        }
    }
}
module.exports = MatchBuilder;

class CustomObjectDesignDigest {

  constructor(DigestsMap, apiVersionMap, workflowFeatureMap) {
    this.DigestsMap = DigestsMap;
    this.apiVersionMap = apiVersionMap;
    this.workflowFeatureMap = workflowFeatureMap;
  }

  getDesignDigests() {
    return Object.values(this.DigestsMap);
  }

  getDesignDigest(globalObjectType) {
    return this.DigestsMap[globalObjectType];
  }

  getDesignApiVersion(globalObjectType) {
    return this.apiVersionMap[globalObjectType];
  }

  getDesignWorkflowFeature(globalObjectType) {
    return this.workflowFeatureMap[globalObjectType];
  }
}

module.exports = CustomObjectDesignDigest;

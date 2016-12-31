class CustomObjectDesignDigest {

  constructor(digestMap, apiVersionMap, workflowFeatureMap) {
    this.digestMap = digestMap;
    this.apiVersionMap = apiVersionMap;
    this.workflowFeatureMap = workflowFeatureMap;
  }

  getDesignDigests() {
    return Object.values(this.digestMap);
  }

  getDesignDigest(globalObjectType) {
    return this.digestMap[globalObjectType];
  }

  getDesignApiVersion(globalObjectType) {
    return this.apiVersionMap[globalObjectType];
  }

  getDesignWorkflowFeature(globalObjectType) {
    return this.workflowFeatureMap[globalObjectType];
  }
}

module.exports = CustomObjectDesignDigest;

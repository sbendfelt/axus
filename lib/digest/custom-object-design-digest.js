class CustomObjectDesignDigest {
  constructor(customDesignDigests, DigestsMap, apiVersionMap, workflowFeatureMap) {
    this.Digests = customDesignDigests;
    this.DigestsMap = DigestsMap;
    this.apiVersionMap = apiVersionMap;
    this.workflowFeatureMap = workflowFeatureMap;
  }

  getDesignDigests() {
    return this.Digests;
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

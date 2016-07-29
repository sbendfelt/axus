const CustomObjectDesignDigest = require('../custom-object-design-Digest');

class CustomObjectDesignDigestBuilder {
    static build(Digests) {
        let customDesignDigests = [];
        let DigestsMap = {};
        let apiVersionMap = {};
        let workflowFeatureMap = {};

        try {
            customDesignDigests = Digests.filter(function(Digest) {
                return Digest && Digest.CustomObjectDesignV110;
            });
            customDesignDigests.forEach(function(customDesignDigest) {
              let key = customDesignDigest.CustomObjectDesignV110.globalObjectType[0];
              DigestsMap[key] = customDesignDigest;
              if ('PRIMARY' === customDesignDigest.CustomObjectDesignV110.designType[0]) {
                apiVersionMap[key] = customDesignDigest.CustomObjectDesignV110.apiVersion[0];
                workflowFeatureMap[key] = customDesignDigest.CustomObjectDesignV110.workflowFeature[0];
              }
            });
            return new CustomObjectDesignDigest(customDesignDigests, DigestsMap, apiVersionMap, workflowFeatureMap);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = CustomObjectDesignDigestBuilder;

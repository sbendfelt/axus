const CustomObjectDesignDigest = require('../custom-object-design-digest');

class CustomObjectDesignDigestBuilder {
    static build(digests) {
        const digestMap = {};
        const apiVersionMap = {};
        const workflowFeatureMap = {};

        digests.filter((digest) => {
            return digest && digest.CustomObjectDesignV110 && 'PRIMARY' === digest.CustomObjectDesignV110.designType[0];
        }).forEach(function(customDesignDigest) {
            const key = customDesignDigest.CustomObjectDesignV110.globalObjectType[0];
            digestMap[key] = customDesignDigest;
            apiVersionMap[key] = customDesignDigest.CustomObjectDesignV110.apiVersion[0];
            workflowFeatureMap[key] = customDesignDigest.CustomObjectDesignV110.workflowFeature[0];
        });
        return new CustomObjectDesignDigest(digestMap, apiVersionMap, workflowFeatureMap);
    }
}

module.exports = CustomObjectDesignDigestBuilder;

const CustomObjectDesignDigest = require('../custom-object-design-digest');

class CustomObjectDesignDigestBuilder {

    static build(digests) {
        const {
            digestMap,
            apiVersionMap,
            workflowFeatureMap
        } = getDigestMaps(digests);
        return new CustomObjectDesignDigest(digestMap, apiVersionMap, workflowFeatureMap);
    }
}

function getDigestMaps(digests) {
    const data = {
        digestMap: {},
        apiVersionMap: {},
        workflowFeatureMap: {}
    };
    return digests
        .filter(isPrimaryCustomObjectDesign)
        .reduce((acc, customDesignDigest) => {
            const key = getGlobalObjectType(customDesignDigest);
            data.digestMap[key] = customDesignDigest;
            data.apiVersionMap[key] = getAPIVersion(customDesignDigest);
            const workflow = getWorkflow(customDesignDigest);
            if (workflow) {
                data.workflowFeatureMap[key] = workflow;
            }
            return acc;
        }, data);
}

function isPrimaryCustomObjectDesign(digest) {
    return digest && digest.CustomObjectDesignV110 &&
        'PRIMARY' === digest.CustomObjectDesignV110.designType[0];
}

function getGlobalObjectType(customDesignDigest) {
    return customDesignDigest.CustomObjectDesignV110.globalObjectType[0];
}

function getAPIVersion(customDesignDigest) {
    return customDesignDigest.CustomObjectDesignV110.apiVersion[0];
}

function getWorkflow(customDesignDigest) {
    if (customDesignDigest.CustomObjectDesignV110.workflowFeature &&
        customDesignDigest.CustomObjectDesignV110.workflowFeature.length) {
        return customDesignDigest.CustomObjectDesignV110.workflowFeature[0];
    }
    return null;
}

module.exports = CustomObjectDesignDigestBuilder;

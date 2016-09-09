const LocalRequest = require('./local-fetch-request');

const validator = {
  validate: function validate(request) {
    const requiredAttributes = [
      '_apiVersion',
      'type',
      '_uid'
    ];
    const unsupportedAtrributes = [
      'params',
      'resource',
      'resourceId'
    ];
    const missingAttr = requiredAttributes.filter((attr) => {
      return !request[attr];
    }).join(', ');
    if(missingAttr) {
      throw new Error(`Request is missing ${missingAttr}`);
    }
    if(request instanceof LocalRequest) {
      const unsupportedAttributesUsed = unsupportedAtrributes.filter((attr) => {
        return request[attr];
      }).join(', ');
      if(unsupportedAttributesUsed) {
        throw new Error(`Request  ${unsupportedAttributesUsed}`);
      }
    }
  }
};

module.exports = validator;

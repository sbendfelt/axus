const Configurations = require('./configurations');

const PRIMARY = 'PRIMARY';
const SUPPORTED = 'SUPPORTED';

class CustomObjectDesignConfiguration {
  constructor(configurations) {
    let primaryDesignMap = {};
    let supportedDesignMap = {};
    if (configurations) {

      try {
        this.customDesignConfigurations = configurations.filter(function(configuration) {
          return configuration && configuration.CustomObjectDesignV110;
        });

        this.customDesignConfigurations.forEach(function(customDesignConfiguration) {
          if (PRIMARY === customDesignConfiguration.CustomObjectDesignV110.designType[0]) {
            primaryDesignMap[customDesignConfiguration.CustomObjectDesignV110.globalObjectType[0]] = customDesignConfiguration;
          } else {
            supportedDesignMap[customDesignConfiguration.CustomObjectDesignV110.globalObjectType[0]] = customDesignConfiguration;
          }
        });
      } catch (err) {
        console.log('Failed to parse custom object design configurations!');
        throw err;
      }
    }
  }

  getPrimaryDesign(globalObjectType) {
    return primaryDesignMap.globalObjectType;
  }

  getSupportedDesign(globalObjectType) {
    return primaryDesignMap.globalObjectType;
  }
}

module.exports = CustomObjectDesignConfiguration;

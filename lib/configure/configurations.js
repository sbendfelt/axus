const CustomObjectDesignConfiguration = require('./custom-object-design-configuration');

class Configurations {
  constructor(configurations) {
    this.customDesignConfigurations = new CustomObjectDesignConfiguration(configurations);
  }

  getCustomObjectDesignConfigurations() {
    return this.customDesignConfigurations;
  }
}

module.exports = Configurations;

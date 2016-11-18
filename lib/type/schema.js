class Schema {

  constructor(schemaDesign, parentType) {
    this.design = schemaDesign.design;
    this.dataDictionary = schemaDesign.DataDictionary;
    this.parent = parentType;
  }

  getApiVersion() {
    return this.parent && this.parent.apiVersion;
  }

  isV310() {
    return this.parent ? this.parent.apiVersion === '310' : false;
  }

  getDesign() {
    return this.design;
  }

  getFieldData() {
    return this.design.fieldData;
  }

  getFieldDataEntry(fieldName) {
    return this.design.fieldData && this.design.fieldData[fieldName];
  }

  getIdentification() {
    return this.design.identification;
  }

  getGlobalObjectType() {
    return this.design.globalObjectType || this.dataDictionary.type;
  }

  getDesignType() {
    return this.design.designType;
  }

  getRuntime() {
    return this.design.runtime;
  }

  getDataDictionary() {
    return this.dataDictionary;
  }

}

module.exports = Schema;

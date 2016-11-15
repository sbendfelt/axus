class Schema {

  constructor(schemaDesign) {
    this.design = schemaDesign.design;
    this.dataDictionary = schemaDesign.DataDictionary;
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

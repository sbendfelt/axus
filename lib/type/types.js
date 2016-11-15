const Type = require('./type');
const v310Type = require('./v310-type');
const TypeCache = require('./type-cache');
const JsTypeChecker = require('./js-type-checker');


/**
 * v310 Designs and Type Definitions
 */
const InvoiceDetailDesign = require('../../designs/310/invoice-detail.json');
const OrderDetailDesign = require('../../designs/310/order-detail.json');
const PackingListDetailDesign = require('../../designs/310/packing-list-detail.json');
const ShippingOrderDesign = require('../../designs/310/shipping-order.json');

const InvoiceDetailType = new v310Type('InvoiceDetail', InvoiceDetailDesign);
const OrderDetailType = new v310Type('OrderDetail', OrderDetailDesign);
const PackingListDetailType = new v310Type('PackingListDetail', PackingListDetailDesign);
const ShippingOrderType = new v310Type('ShippingOrder', ShippingOrderDesign);


const APPX_TYPES = getCacheCopy();

/**
 * Returns new instance of all
 * core appx types.
 */
function getCacheCopy() {
    return new TypeCache().registerAll([
        InvoiceDetailType,
        OrderDetailType,
        PackingListDetailType,
        ShippingOrderType,
    ]);
}

/**
 * isAppXObject - determines if the object in question has the markings of an
 *                AppX object (__metadata.type)
 *
 * @param  {object} o object in question
 * @return {boolean} isAppXObject true if __metadata.type is present, else false
 */
function isAppXObject(o) {
    return getAppXType(o) && getAppXApiVersion(o) ? true : false;
}

/**
 * getAppXType - returns $.__metadata.type if present, else undefined.
 *
 * @param  {type} o object in question
 * @return {string} type the type string from the object's __metadata
 */
function getAppXType(o) {
    return o && o.__metadata && o.__metadata.type;
}

/**
 * getAppXApiVersion - returns $.__metadata.apiVersion if present,
 *                     else undefined.
 *
 * @param  {type} o object in question
 * @return {string} apiVersion the version string from the object's __metadata
 */
function getAppXApiVersion(o) {
    return o && o.__metadata && o.__metadata.apiVersion;
}

/**
 * getTypeDefinition - returns the Type instance for this object if the object
 *                     is a recognizable appx type.
 *
 * @param  {type} o object who's type def we need
 * @return {Type} t type def or nully
 */
function getTypeDefinition(o) {
    return isAppXObject(o) ?
        APPX_TYPES.get(getAppXApiVersion(o), getAppXType(o)) :
        null;
}

/**
 * isRecognizableAppXType - returns true if o isAppXObject and it's type has
 *                          been registered with APPX_TYPES.
 *
 * @param  {type} o description
 * @return {type}   description
 */
function isRecognizableAppXType(o) {
    if (!isAppXObject(o)) {
        return false;
    }
    const key = Type.keyFunction(getAppXApiVersion(o), getAppXType(o));
    return APPX_TYPES.hasKey(key);
}

exports.getCacheInstance = () => APPX_TYPES;
exports.getCacheCopy = getCacheCopy;
exports.getAppXType = getAppXType;
exports.isAppXObject = isAppXObject;
exports.getTypeDefinition = getTypeDefinition;
exports.isRecognizableAppXType = isRecognizableAppXType;
exports.isPrimitive = JsTypeChecker.isPrimitive;
exports.isDate = JsTypeChecker.isDate;
exports.isArray = JsTypeChecker.isArray;

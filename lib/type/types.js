const Type = require('./type');
const TypeCache = require('./type-cache');

const objectTag = '[object Object]';
const dateTag = '[object Date]';
const stringTag = '[object String]';
const numberTag = '[object Number]';
const booleanTag = '[object Boolean]';

const InvoiceDetailDesign = require('../../designs/InvoiceDetail.json');
const OrderDetailDesign = require('../../designs/OrderDetail.json');
const PackingListDetailDesign = require('../../designs/PackingListDetail.json');
const ShippingOrderDesign = require('../../designs/ShippingOrder.json');

const InvoiceDetailType = new Type('InvoiceDetail', InvoiceDetailDesign);
const OrderDetailType = new Type('OrderDetail', OrderDetailDesign);
const PackingListDetailType = new Type('PackingListDetail', PackingListDetailDesign);
const ShippingOrderType = new Type('ShippingOrder', ShippingOrderDesign);


/**
 * Instance of all known / declared AppX Types.
 */
const APPX_TYPES = new TypeCache().registerAll([
    InvoiceDetailType,
    OrderDetailType,
    PackingListDetailType,
    ShippingOrderType,
]);


/**
 * isAppXObject - determines if the object in question has the markings of an
 *                AppX object (__metadata.type)
 *
 * @param  {object} o object in question
 * @return {boolean} isAppXObject true if __metadata.type is present, else false
 */
function isAppXObject(o) {
    return getAppXType(o) ? true : false;
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
 * getTypeDefinition - returns the Type instance for this object if the object
 *                     is a recognizable appx type.
 *
 * @param  {type} o object who's type def we need
 * @return {Type} t type def or nully
 */
function getTypeDefinition(o) {
    return isAppXObject(o) ? APPX_TYPES.get(getAppXType(o)) : null;
}


/**
 * isRecognizableAppXType - returns true if o isAppXObject and it's type has
 *                          been registered with APPX_TYPES.
 *
 * @param  {type} o description
 * @return {type}   description
 */
function isRecognizableAppXType(o) {
  return isAppXObject(o) ? APPX_TYPES.hasKey(getAppXType(o)) : false;
}

function isString(x) {
    return typeof x == `string` ?
        true :
        (x instanceof String ?
            true :
            (Object.prototype.toString.apply(x) === stringTag ?
                true :
                false));
}

function isNumber(x) {
    return typeof x === `number` ?
        true :
        (x instanceof Number ?
            true :
            (Object.prototype.toString.apply(x) === numberTag ?
                true :
                false));
}

function isBoolean(x) {
    return typeof x === `boolean` ?
        true :
        (x instanceof Boolean ?
            true :
            (Object.prototype.toString.apply(x) === booleanTag ?
                true :
                false));
}

function isDate(x) {
    return x instanceof Date ?
        true :
        (Object.prototype.toString.apply(x) === dateTag ?
            true :
            false);
}

function isPrimitive(x) {
    return isString(x) || isNumber(x) || isBoolean(x);
}

function isArray(x) {
    return Array.isArray(x);
}

exports.getAppXType = getAppXType;
exports.isAppXObject = isAppXObject;
exports.getTypeDefinition = getTypeDefinition;
exports.isRecognizableAppXType = isRecognizableAppXType;
exports.isPrimitive = isPrimitive;
exports.isDate = isDate;
exports.isArray = isArray;

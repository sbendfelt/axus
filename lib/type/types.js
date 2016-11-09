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

const APPX_TYPES = new TypeCache().registerAll([
    InvoiceDetailType,
    OrderDetailType,
    PackingListDetailType,
    ShippingOrderType,
]);

function isAppXObject(o) {
    return getAppXType(o) ? true : false;
}

function getAppXType(o) {
    return o && o.__metadata && o.__metadata.type;
}

function getType(o) {
    return isAppXObject(o) ? APPX_TYPES.get(getAppXType(o)) : null;
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
exports.getType = getType;
exports.isPrimitive = isPrimitive;
exports.isDate = isDate;
exports.isArray = isArray;

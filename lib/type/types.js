const Type = require('./type');
const TypeCache = require('./type-cache');

const objectTag = '[object Object]';
const dateTag = '[object Date]';
const stringTag = '[object String]';

const InvoiceDetailDesign = require('../../designs/InvoiceDetail.json');
const OrderDetailDesign   = require('../../designs/OrderDetail.json');
const PackingListDetailDesign = require('../../designs/PackingListDetail.json');
const ShippingOrderDesign = require('../../designs/ShippingOrder.json');

const InvoiceDetailType = new Type('InvoiceDetail', InvoiceDetailDesign);
const OrderDetailType = new Type('OrderDetail', OrderDetailDesign);
const PackingListDetailType = new Type('PackingListDetail', PackingListDetailDesign);
const ShippingOrderType = new Type('ShippingOrder', ShippingOrderDesign);

var CORE_APPX_TYPES = new TypeCache().registerAll([
    InvoiceDetailType,
    OrderDetailType,
    PackingListDetailType,
    ShippingOrderType,
]);

//isRecognizableType:: string -> boolean
function isRecognizableType(type) {
    if (type instanceof Type) {
        return type && CORE_APPX_TYPES.get(type) !== null;
    }
}

function isAppXObject(o) {
    return getAppXType(o) ? true : false;
}

function getAppXType(o) {
    return o && o.__metadata && o.__metadata.type;
}

//isUnrecognizableType :: string -> boolean
function isUnrecognizableType(type) {
    return !isRecognizableType(type);
}

function getType(o) {
    let t;
    if (isAppXObject(o)) {
        t = CORE_APPX_TYPES.get(o.__metadata.type);
        if (!t) {
            throw new Error('didnt find a type');
        }
        return t;
    }
    throw new Error('not a type');
    //TODO:
    // 1. figure out how to check for intermediary types in Appx
    // 2. figure out good plain object check. i.e. Date vs Object
}

function isString(x) {
    return typeof x == `string` ?
        true :
        (x instanceof String ?
            true :
            (Object.prototype.toString.apply(x) === '[object String]' ?
                true :
                false));
}

exports.isAppXObject = isAppXObject;
exports.getType = getType;

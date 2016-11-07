const Type = require('./type');
const TypeCache = require('./type-cache');

const objectTag = '[object Object]';
const dateTag = '[object Date]';
const stringTag = '[object String]';

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
            (Object.prototype.toString.apply(x) === '[object String]' ?
                true :
                false));
}

exports.getAppXType = getAppXType;
exports.isAppXObject = isAppXObject;
exports.getType = getType;

const objectTag = '[object Object]';
const dateTag = '[object Date]';
const stringTag = '[object String]';
const numberTag = '[object Number]';
const booleanTag = '[object Boolean]';
const functionTag = '[object Function]';

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

function isFunction(x) {
  return Object.prototype.toString.apply(x) === functionTag;
}

function isPromise(x) {
  return isFunction(x.then);
}

exports.isFunction = isFunction;
exports.isPromise = isPromise;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isBoolean = isBoolean;
exports.isDate = isDate;
exports.isPrimitive = isPrimitive;
exports.isArray = isArray;

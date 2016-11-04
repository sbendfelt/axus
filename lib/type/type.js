//------------------------------------------------------------------------------
//  TYPES
//    Core types are said to be those defined by the public v310 REST API
//    A TypeCache holds all the known types.
//    Types are aliasable.
//------------------------------------------------------------------------------
const objectTag = '[object Object]';
const dateTag = '[object Date]';
const stringTag = '[object String]';


class Type {

  constructor(typeString, design, ...aliases) {
    this.type = typeString;
    this.design = design;
    this.aliases = aliases;
     //TODO: get this from the designs folder.
  }

  alias(name) {
    this.aliases.push(name);
    return this;
  }

  getAliases() {
    return this.aliases.slice();
  }

  getKeys() {
    return this.getAliases().concat(this.type);
  }

  // isRecognizable(t) {
  //
  // }
  //
  //
  // need to register this with the cache in such a way that modifying one
  // modifies the other.
  // i.e. we create a type. add it to the cache at start up,
  // then user defines new alias for it. currently cache would not get that msg.
}

class TypeCache {
  constructor() {
    this.cache = {};
  }

  add(t) {
    const lCache = this.cache;
    t.getKeys().forEach((k) => {
      if(lCache[k]) {
        throw new Error(`Cannot add duplicate keys to the
          TypeCache (${k})`);
      }
      lCache[k] = t;
    });
  }

  addAll(ts) {
    ts.forEach(this.add.bind(this));
    return this;
  }

  get(typeString) {
    return this.cache[typeString];
  }
}


var ShippingOrderType = new Type('ShippingOrder', require('../../designs/ShippingOrder.json'));
// var InvoiceType = new Type('InvoiceDetail');
var PackingListType = new Type('PackingListDetail', require('../../designs/PackingListDetail.json'));

var CORE_APPX_TYPES = new TypeCache().addAll([
  ShippingOrderType,
  // OrderType,
  // InvoiceType,
  PackingListType
]);

//isRecognizableType:: string -> boolean
function isRecognizableType(type) {
  if(type instanceof Type) {
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
    if(!t) {
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

exports.Type = Type;
exports.isAppXObject = isAppXObject;
exports.getType = getType;

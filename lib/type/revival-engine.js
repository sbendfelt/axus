const Types = require('../type/types');
const ObjectUtils = require('./object-utils');

const IGNORE_KEYS = [
    'self',
    'fingerprint'
];

/**
 * revive - wrapper to be called by JSON.stringify
 *
 * @param  {type} k current key that JSON.parse is targeting
 * @param  {type} v value that current key point to.
 * @return {type} object the (maybe) revived object
 */
function revive(k, v) {
    return reviveAppXObject(v);
}

/**
 * revive - revives the plain js object if it is an AppX object.
 *          Otherwise, returns the plain old js object.
 *
 * @param  {type} o the maybe appx obj that we want to revive.
 * @return {type} object the (maybe) revived object
 */
function reviveAppXObject(o) {
    if (!Types.isRecognizableAppXType(o)) {
        return o;
    }
    const appxType = Types.getTypeDefinition(o);
    const dictionary = appxType.schema.DataDictionary;
    const topLvlType = dictionary.type;
    const root = dictionary[topLvlType];
    return transform(o, root, appxType.schema);
}

/**
 * transform - leverages the current dictionary to transform any scalar fields,
 *             otherwise recurses to transform object(map)/collection.
 *
 * @param  {object} target     the object that we want to transform
 * @param  {object} dictScope  the dictionary entry for the current target
 * @param  {object} dictionary the entire dictionary from the design.
 */
function transform(source, dictScope, schema) {
    const dictionary = schema.DataDictionary;
    const destination = {};
    Object
        .keys(source)
        .forEach((k) => {
            const val = source[k];
            const typeDesc = dictScope[k];
            let nextDictScope;
            if (k === '__metadata') {
                destination[k] = ObjectUtils.clone(val);
                return;
            }
            if (IGNORE_KEYS.indexOf(k) !== -1) {
                destination[k] = val;
                return;
            }
            //TODO: isCustomObject check necessary?
            if (k === 'uid' && isCustomObject(dictionary)) {
                destination[k] = val;
                return;
            }
            if (!typeDesc && isCustomObject(dictionary)) {
                const auxilliaryData = getAuxilliaryFieldData(schema, k);
                if (auxilliaryData) {
                    const root = auxilliaryData.root;
                    const newSchema = auxilliaryData.schema;
                    transform(val, root, newSchema);
                    return;
                }
            }
            if (!typeDesc) {
                throw new Error(`Illegal State Exception.
                  No typeDesc for ${k} -> ${JSON.stringify(val)}
                  In dictScope ${JSON.stringify(dictScope)}`);
            }
            nextDictScope = dictionary[typeDesc.type];
            if (typeDesc.type === 'TEXT') {
                destination[k] = source[k];
            } else if (typeDesc.type === 'COMPLEX') {
                destination[k] = source[k].slice();
            } else if (typeDesc.type === 'DATE') {
                destination[k] = new Date(val);
            } else if (typeDesc.type === 'NUMBER') {
                destination[k] = Number(val);
            } else if (typeDesc.type === 'BOOLEAN') {
                destination[k] = Boolean(val);
            } else if (typeDesc.isCollection) {
                destination[k] = transformCollection(val, nextDictScope, schema);
            } else if (typeDesc.isMap) {
                destination[k] = transformMap(val, nextDictScope, schema);
            } else {
                destination[k] = transform(val, nextDictScope, schema);
            }
        });
    return destination;
}

/**
 * transformCollection - Helper function, transforms each element in the
 *                       collection according to the dictScope given.
 *
 * @param  {object} target     the object that we want to transform
 * @param  {object} dictScope  the dictionary entry for the current target
 * @param  {object} schema     the entire design
 */
function transformCollection(sources, dictScope, schema) {
    return sources.map((source) => {
        return transform(source, dictScope, schema);
    });
}

/**
 * transformMap - Helper function, transforms each entry in a map, according to
 *                the dictScope, infers the type of map.
 *
 *                There are currently three types of maps supported.
 *                1) Simple Key-Value maps, such as a References section. These
 *                   maps have dictScope's which have special $key and $value
 *                   entries.
 *                2) An indirectMap has some key that points to either a single
 *                   object that conforms to the dictScope, or an array of
 *                   that each fit the dictScope.
 *                3) A regular map that does not fit any of the above criteria.
 *
 * @param  {object} target     the object that we want to transform
 * @param  {object} dictScope  the dictionary entry for the current target
 * @param  {object} dictionary the entire dictionary from the schema.
 */
function transformMap(target, dictScope, schema) {
    if (isSimpleKVMap(dictScope)) {
        return transform(target, makeKVDict(target, dictScope.$value), schema);
    } else if (isIndirectMap(target, dictScope)) {
        return transformIndirectMap(target, dictScope, schema);
    } else {
        return transform(target, dictScope, schema);
    }
}

function transformIndirectMap(target, dictScope, schema) {
    return Object
        .keys(target)
        .reduce((acc, v) => {
            const mapEntry = target[v];
            if (Array.isArray(mapEntry)) {
                acc[v] = transformCollection(mapEntry, dictScope, schema);
            } else {
                acc[v] = transform(mapEntry, dictScope, schema);
            }
            return acc;
        }, {});
}


/**
 * isSimpleKVMap - determines if the dictScope is for a simple KV map.
 *
 * @param  {type} dictScope the scope of the dictionary in question.
 * @return {boolean} isSimpleKVMap
 */
function isSimpleKVMap(dictScope) {
    return dictScope.$key && dictScope.$value;
}

/**
 * makeKVDict - simple KV maps don't fit our recursion pattern.
 *
 *              We use the the simpleKVmap's dict entry and our current
 *              object to create a new dict entry that does.
 *
 * @param  {type} obj  description
 * @param  {type} dict description
 * @return {type}      description
 */
function makeKVDict(obj, dict) {
    return Object
        .keys(obj)
        .reduce((acc, next) => {
            acc[next] = dict;
            return acc;
        }, {});
}


/**
 * isIndirectMap - when the keys of our target are not in the dict, we can
 *                 assume that we have an inDirectMap, such as the Party section.
 *
 * @param  {type} target    description
 * @param  {type} dictScope description
 * @return {type}           description
 */
function isIndirectMap(target, dictScope) {
    return !Object.keys(target).some((k) => dictScope.hasOwnProperty(k));
}

//TODO: this might not be the smartest impl. could also just use schema.design
function isCustomObject(dictionary) {
    return dictionary.type.startsWith('$');
}

//TODO: break this down. remove dependency on v310
function getAuxilliaryFieldData(schema, key) {
    const fieldData = schema.design && schema.design.fieldData;
    const fieldDataEntry = fieldData[key];
    if (!fieldDataEntry) {
        return null;
    }
    const typeDef = Types.getV310TypeDefinition(fieldDataEntry.type);
    if (!typeDef) {
        return null;
    }
    const dd = typeDef.schema.DataDictionary;
    const root = dd[fieldDataEntry.type] || dd[initCap(fieldDataEntry.type)];
    return root ? {
        schema: typeDef.schema,
        root: root
    } : null;
}

function initCap(str) {
    return str
        .toLowerCase()
        .replace(/(?:^|\s)[a-z]/g, (c) => {
            return c.toUpperCase();
        });
}


exports.revive = revive;

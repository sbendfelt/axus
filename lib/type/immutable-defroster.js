const AppRootDir = require('app-root-dir').get();
const fs = require(`fs`);
const path = require('path');
const Types = require('../type/types');

/**
 * REGEX's to identify the three date formats used by AppX.
 */
const APPX_DATE_FMT = /^(\d{4})-(\d{2})-(\d{2})(\s{1}((\d{2}):(\d{2}):(\d{2})\.(\d*)))?$/;
const STANDARD_DATE_FMT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/;

class ImmutableDefroster {

    constructor() {}

    /**
     * defrostPath - defrosts a json file at the given path if we can
     *               find its DD
     *
     * @param  {string} p path to the json file that needs revival    .
     * @return {object} o the (maybe) defrosted object.
     */
    defrostPath(p) {
        p = path.resolve(AppRootDir, p);
        let contents;
        const stats = fs.lstatSync(p);
        if (!stats.isFile()) { //TODO: throws error when the path points to nothing.
            throw new Error(`Expected a path to a file.
        Could not locate a file @ ${path}`);
        }
        contents = fs.readFileSync(p, 'utf-8');
        return JSON.parse(contents, revive);
    }


    /**
     * defrost - defrosts an object if we can find its DD.
     *
     * @param  {type} object description
     * @return {type}        description
     */
    defrost(object) {
        return reviveAppXObject(object);
    }

}

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
    if (!Types.isAppXObject(o) /*|| Types.isUnrecognizableType(v)*/ ) {
        return o;
    }
    const appxType = Types.getType(o);
    const dictionary = appxType.design.DataDictionary;
    const topLvlType = dictionary.type;
    const root = dictionary[topLvlType];
    return transform(o, root, dictionary);
}

/**
 * transform - leverages the current dictionary to transform any scalar fields,
 *             otherwise recurses to transform object(map)/collection.
 *
 * @param  {object} target     the object that we want to transform
 * @param  {object} dictScope  the dictionary entry for the current target
 * @param  {object} dictionary the entire dictionary from the design.
 */
function transform(source, dictScope, dictionary) {
    const destination = {};
    Object
        .keys(source)
        .forEach((k) => {
            const val = source[k];
            const typeDesc = dictScope[k];
            let nextDictScope;
            if (k === '__metadata') {
                destination[k] = clone(val);
                return;
            }
            if (!typeDesc) {
                throw new Error(`Illegal State Exception.
                  No typeDesc for ${k} -> ${val}
                  In dictScope ${JSON.stringify(dictScope)}`);
            }
            nextDictScope = dictionary[typeDesc.type];
            if (typeDesc.type === 'TEXT') {
                destination[k] = source[k];
            } else if (typeDesc.type === 'COMPLEX') {
                destination[k] = source[k].slice();
                // so far we've only encountered COMPLEX
                // where the elements are primitives.
            } else if (typeDesc.type === 'DATE') {
                destination[k] = new Date(val);
            } else if (typeDesc.type === 'NUMBER') {
                destination[k] = Number(val);
            } else if (typeDesc.type === 'BOOLEAN') {
                destination[k] = Boolean(val);
            } else if (typeDesc.isCollection) {
                destination[k] = transformCollection(val, nextDictScope, dictionary);
            } else if (typeDesc.isMap) {
                destination[k] = transformMap(val, nextDictScope, dictionary);
            } else {
                destination[k] = transform(val, nextDictScope, dictionary);
            }
        });
    return destination;
}

function clone(o) {
    if (Types.isPrimitive(o)) {
        return o;
    }
    if (Types.isDate(o)) {
        const d = new Date();
        d.setTime(o.getTime());
        return d;
    }
    if (Types.isArray(o)) {
        return o.map(clone);
    }
    //Object
    return Object.keys(o).reduce((acc, k) => {
        acc[k] = clone(o[k]);
        return acc;
    }, {});
}


/**
 * transformCollection - Helper function, transforms each element in the
 *                       collection according to the dictScope given.
 *
 * @param  {object} target     the object that we want to transform
 * @param  {object} dictScope  the dictionary entry for the current target
 * @param  {object} dictionary the entire dictionary from the design.
 */
function transformCollection(sources, dictScope, dictionary) {
    return sources.map((source) => {
        return transform(source, dictScope, dictionary);
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
 * @param  {object} dictionary the entire dictionary from the design.
 */
function transformMap(target, dictScope, dictionary) {
    if (isSimpleKVMap(dictScope)) {
        return transform(target, makeKVDict(target, dictScope.$value), dictionary);
    } else if (isIndirectMap(target, dictScope)) {
        return transformIndirectMap(target, dictScope, dictionary);
    } else {
        return transform(target, dictScope, dictionary);
    }
}

function transformIndirectMap(target, dictScope, dictionary) {
    return Object
        .keys(target)
        .reduce((acc, v) => {
            const mapEntry = target[v];
            if (Array.isArray(mapEntry)) {
                acc[v] = transformCollection(mapEntry, dictScope, dictionary);
            } else {
                acc[v] = transform(mapEntry, dictScope, dictionary);
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
 * isIndirectMap - when the keys of our target are not in the design, we can
 *                 assume that we have an inDirectMap, such as the Party section.
 *
 * @param  {type} target    description
 * @param  {type} dictScope description
 * @return {type}           description
 */
function isIndirectMap(target, dictScope) {
    return !Object.keys(target).some((k) => dictScope.hasOwnProperty(k));
}

module.exports = ImmutableDefroster;

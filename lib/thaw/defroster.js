const AppRootDir = require('app-root-dir').get();
const fs = require(`fs`);
const path = require('path');
const Type = require('../type/type');

const APPX_DATE_FMT = /^(\d{4})-(\d{2})-(\d{2})(\s{1}((\d{2}):(\d{2}):(\d{2})\.(\d*)))?$/;
const STANDARD_DATE_FMT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/;

module.exports = class Defroster {

    constructor() {}

    defrost(p) {
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

};

function revive(k, v) {
    if (!Type.isAppXObject(v)) {
        return v;
    }
    const appxType = Type.getType(v);
    const dictionary = appxType.design.DataDictionary;
    const topLvlType = dictionary.type;
    const root = dictionary[topLvlType];
    transform(v, root, dictionary);
    return v;
}

function transform(target, dictScope, dictionary) {
    Object.keys(target)
        .filter((k) => k !== '__metadata')
        .forEach((k) => {
            const val = target[k];
            const typeDesc = dictScope[k];
            let nextDictScope;
            if (!typeDesc) {
                throw new Error(`Illegal State Exception. No typeDesc for ${k} -> ${val}`);
            }
            nextDictScope = dictionary[typeDesc.type];
            if (typeDesc.type === 'TEXT') {
                //no-op?
            } else if (typeDesc.type === 'DATE') {
                target[k] = new Date(val);
            } else if (typeDesc.type === 'NUMBER') {
                target[k] = Number(val);
            } else if(typeDesc.type === 'BOOLEAN') {
                target[k] = Boolean(val);
            } else if (typeDesc.type === 'COMPLEX') {
                throw new Error('wat do');
            } else if (typeDesc.isCollection) {
                transformCollection(val, nextDictScope, dictionary);
            } else if (typeDesc.isMap) {
                transformMap(val, nextDictScope, dictionary);
            } else {
                transform(val, nextDictScope, dictionary);
            }
        });
}

function transformCollection(targets, dictScope, dictionary) {
    targets.forEach((target) => {
        transform(target, dictScope, dictionary);
    });
}

function transformMap(target, dictScope, dictionary) {
    if (isSimpleKVMap(dictScope)) {
        transform(target, makeKVDict(target, dictScope.$value), dictionary);
    } else if (isIndirectMap(target, dictScope)) {
        Object.keys(target).forEach((v) => {
            const mapEntry = target[v];
            if (Array.isArray(mapEntry)) {
                transformCollection(mapEntry, dictScope, dictionary);
            } else {
                transform(mapEntry, dictScope, dictionary);
            }
        });
    } else {
        transform(target, dictScope, dictionary);
    }
}

function isSimpleKVMap(dictScope) {
    return dictScope.$key && dictScope.$value;
}

function isIndirectMap(target, dictScope) {
    return !Object.keys(target).some((k) => dictScope.hasOwnProperty(k));
}

function makeKVDict(obj, dict) {
    return Object
        .keys(obj)
        .reduce((acc, next) => {
            acc[next] = dict;
            return acc;
        }, {});
}

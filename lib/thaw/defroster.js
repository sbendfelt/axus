const AppRootDir = require('app-root-dir').get();
const fs = require(`fs`);
const path = require('path');
const Type = require('../type/type');

const APPX_DATE_FMT = /^(\d{4})-(\d{2})-(\d{2})(\s{1}((\d{2}):(\d{2}):(\d{2})\.(\d*)))?$/;
const STANDARD_DATE_FMT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/;

module.exports = class Defroster {
    constructor() {}

    thaw(p) {
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
    return resurrect(v);
}

function resurrect(appxObject) {
    const appxType = Type.getType(appxObject);
    const dictionary = appxType.design.DataDictionary;
    const topLvlType = dictionary.type;
    const root = dictionary[topLvlType];
    transform(appxObject, root, dictionary);
    return appxObject;
}

function transform(target, dictScope, dictionary) {
    Object.keys(target)
        .filter((k) => k !== '__metadata')
        .forEach((k) => {
            const val = target[k];
            const typeDesc = dictScope[k];
            if (!typeDesc) {
                throw new Error(`Illegal State Exception. No typeDesc for ${k} -> ${val}`);
            }
            if (typeDesc.type === 'TEXT') {
                //no-op?
            } else if (typeDesc.type === 'DATE') {
                console.log(`WE HAVE A DATE FOR ${k}`);
                target[k] = new Date(val);
            } else if (typeDesc.type === 'NUMBER') {
                target[k] = Number(val);
            } else if (typeDesc.type === 'COMPLEX') {
                throw new Error('wat do');
            } else if (typeDesc.isCollection) {
                val.forEach((v) => {
                    transform(v, dictionary[typeDesc.type], dictionary);
                });
            } else if (typeDesc.isMap) {
                const mapInstructions = dictionary[typeDesc.type];
                if (mapInstructions.$key) {
                    if (mapInstructions.$key.type !== 'TEXT') {
                        throw new Error('weird keys');
                    }
                    transform(val, subDict(val, mapInstructions.$value), dictionary);
                } else if (isIndirectMap(val, mapInstructions)) {
                    Object.keys(val).forEach((v) => {
                        const mapEntry = val[v];
                        if (Array.isArray(mapEntry)) {
                            mapEntry.forEach(e => {
                                transform(e, mapInstructions, dictionary);
                            });
                        } else {
                            transform(mapEntry, mapInstructions, dictionary);
                        }
                    });
                } else {
                    transform(val, mapInstructions, dictionary);
                }
            } else {
                const dictEntry = dictionary[typeDesc.type];
                transform(val, dictEntry, dictionary);
            }
        });
}

function isIndirectMap(target, mapInstruction) {
    return !Object.keys(target).some((k) => mapInstruction.hasOwnProperty(k));
}

//TODO: rename
function subDict(obj, dict) {
    return Object
        .keys(obj)
        .reduce((acc, next) => {
            acc[next] = dict;
            return acc;
        }, {});
}

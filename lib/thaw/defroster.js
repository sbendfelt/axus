const AppRootDir = require('app-root-dir').get();
const fs = require(`fs`);
const path = require('path');
const Type = require('../type/type');

const APPX_DATE_FMT = /^(\d{4})-(\d{2})-(\d{2})(\s{1}((\d{2}):(\d{2}):(\d{2})\.(\d*)))?$/;
const STANDARD_DATE_FMT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/;

let prefix = ' ';
let inc = () => prefix += ' ';
let dec = () => {
  if(prefix.length > 1) {
    prefix -= ' ';
  }
  if(prefix === 0) {
    prefix = ' ';
  }
};
let _log = (arg) => console.log(prefix + arg);


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
    if (Type.isAppXObject(v)) {
        return resurrect(v);
    }
    return v;
}

function resurrect(appxObject) {
    const appxType = Type.getType(appxObject);
    const dictionary = appxType.design.DataDictionary;
    const topLvlType = dictionary.type;
    const root = dictionary[topLvlType];
    _log(`PRAISE RA! starting resurrection for\n\t->${topLvlType}\n`);
    foo(appxObject, root, dictionary);
    return appxObject;
}

function foo(target, dictScope, dictionary) {
    // _log(`beginning
    //   ${JSON.stringify(target)}
    //   ->
    //   ${JSON.stringify(dictScope)}`);
    inc();
    _log('begin');
    Object.keys(target)
        .filter((k) => k !== '__metadata')
        .forEach((k) => {
            const val = target[k];
            const typeDesc = dictScope[k];
            if (!typeDesc) {
                throw new Error(`Houston we have a problem.
                  No typeDesc for ${k} -> ${val}`);
            }
            _log(`${k} -> ${typeDesc.type}`);
            if (typeDesc.isCollection) {
              _log(`Collection :: ${k} -> ${typeDesc.type}`);
              val.forEach((v) => {
                foo(v, dictionary[typeDesc.type], dictionary);
              });
            } else if (typeDesc.isMap) {
              // _log(`Handling map ${v} -> ${val[v]} as type ${typeDesc.type}`);
              const mapInstructions = dictionary[typeDesc.type];
              _log(`mapInstructions :: ${JSON.stringify(mapInstructions)}`);
                if(mapInstructions.$key) {

                } else if(isIndirectMap(val, mapInstructions)) {
                  Object.keys(val).forEach((v) => {
                    const mapEntry = val[v];
                    if(Array.isArray(mapEntry)) {
                      mapEntry.forEach(e => {
                        foo(e, mapInstructions, dictionary);
                      });
                    } else {
                      foo(mapEntry, mapInstructions, dictionary);
                    }
                  });
                } else {
                  foo(val, mapInstructions, dictionary);
                }
            } else if (typeDesc.type === 'TEXT') {
                //no-op?
            } else if (typeDesc.type === 'DATE') {
                _log(`WE HAVE A DATE FOR ${k}`);
                target[k] = new Date(val);
            } else if (typeDesc.type === 'NUMBER') {
                target[k] = Number(val);
            } else if (typeDesc.type === 'COMPLEX') {

            } else {
                const dictEntry = dictionary[typeDesc.type];
                _log(`\tabout to recurse for ${k} -> ${typeDesc.type}`);
                foo(val, dictEntry, dictionary);
            }
        });
        _log('-- end recurse -- \n');
        dec();
}

function isIndirectMap(target, mapInstruction) {
  return !Object.keys(target).some((k) => mapInstruction.hasOwnProperty(k));
}

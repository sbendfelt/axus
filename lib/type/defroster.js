const AppRootDir = require('app-root-dir').get();
const fs = require(`fs`);
const path = require('path');
const RevivalEngine = require('./revival-engine');

/**
 * REGEX's to identify the three date formats used by AppX.
 */
const APPX_DATE_FMT = /^(\d{4})-(\d{2})-(\d{2})(\s{1}((\d{2}):(\d{2}):(\d{2})\.(\d*)))?$/;
const STANDARD_DATE_FMT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/;

class Defroster {

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
        return JSON.parse(contents, RevivalEngine.revive);
    }

    /**
     * defrost - defrosts an object if we can find its DD.
     *
     * @param  {type} object description
     * @return {type}        description
     */
    defrost(object) {
        return RevivalEngine.revive(null, object);
    }

}

module.exports = Defroster;

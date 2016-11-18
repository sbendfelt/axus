//TODO: belongs in a more 'commons' like package?

const Types = require('./types');

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

exports.clone = clone;

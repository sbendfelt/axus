const HelpEntry = require('./help-entry');

exports.flatHierarchy = (docs) => docs.map((d) => new HelpEntry(d));

exports.buildClassHierarchy = function buildClassHierarchy(docs) {
    const classes = {},
        children = {},
        helpEntries = [];
    for (let doc of docs) {
        const entry = new HelpEntry(doc);
        helpEntries.push(entry);
        if (doc.kind === 'class') {
            const key = doc.longname;
            classes[key] = entry;
            if (children[key] && children[key].length) {
                entry.addChildren(children[key]);
                children[key] = [];
            }
        } else {
            const key = doc.memberof;
            const parent = classes[key];
            if (parent) {
                parent.addChild(entry);
            } else {
                if (!children[key]) {
                    children[key] = [];
                }
                children[key].push(entry);
            }
        }
    }
    return helpEntries;
};

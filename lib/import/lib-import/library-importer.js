const ImportScanner = require('./import-scanner');
const fs = require('fs');

class LibraryImporter {

    constructor(libraryNormalizationFn) {
        this.libraryNormalizationFn = libraryNormalizationFn;
    }

    getImportedScripts(scripts) {
    return ImportScanner
            .scan(scripts)
      .map(this.libraryNormalizationFn)
      .map((anImport) => {
            return fs.readFileSync(anImport, 'utf-8');
        });
    }

}

module.exports = LibraryImporter;

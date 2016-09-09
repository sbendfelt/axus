const ImportScanner = require('./import-scanner');

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

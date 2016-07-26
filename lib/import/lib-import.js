const IMPORT_FLAG = "!import";
const blockStartSymbol = '/*';
const blockEndSymbol = '*/';
const singLineCmtSymbol = '//';

let ImportScanner = (function() {

  function scan(scripts) {
    if (!scripts) {
      return [];
    }
    return scripts.map(parseScript).reduce((a, b) => {
      return a.concat(b);
    }, []);
  }

  function parseScript(script) {
    let lines = script.split('\n');
    if (!lines.length) {
      return [];
    }
    let imports = [];
    let isBlock = false;
    while (lines.length) {
      let next = lines.shift();
      let blockStart = next.indexOf('/*');
      let blockEnd = next.indexOf('*/');
      let singLineCmt = next.indexOf('//');
      if (!isBlock) {
        isBlock = blockStart > -1 ? true : false;
      }
      if ((isBlock || singLineCmt > -1) && next.indexOf(IMPORT_FLAG) > -1) {
        imports = imports.concat(scrapeLine(next));
      }
    }
    return imports.filter((t) => {
      return t;
    });
  }

  function scrapeLine(line) {
    let tokens = line
      .replace(blockStartSymbol, '')
      .replace(blockEndSymbol, '')
      .replace(singLineCmtSymbol, '')
      .replace(IMPORT_FLAG, ' ')
      .replace(/,+/g, ' ')
      .trim()
      .split(/\s+/);
    return tokens.map((token) => {
      if (token) {
        return token;
      }
      return undefined;
    });
  }

  return {
    scan: scan
  };

}());

module.exports = ImportScanner;

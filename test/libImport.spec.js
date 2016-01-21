let expect = require('chai').expect;
let LibImport = require('../lib/import/libImport.js');

describe('libImport', () => {
  it('can read a single line, single import stmnt', (done) => {
    let scripts = ["//!import dummy.js\r\nvar jake = (() => {\r\n  return {\r\n    name: 'jake',\r\n    isADog: 'true'\r\n  };\r\n}());"];
    let imports = LibImport.scan(scripts);
    expect(imports).to.deep.equal(['dummy.js']);
    expect(imports.length).to.equals(1);
    done();
  });

  it('can read a single line, multiple import stmnt', (done) => {
    let scripts = ["//!import dumb.js, dumber.js,\tjeff.js,    jim.js\r\nvar jake = (() => {\r\n  return {\r\n    name: 'jake',\r\n    isADog: 'true'\r\n  };\r\n}());"];
    let imports = LibImport.scan(scripts);
    expect(imports.length).to.equal(4);
    expect(imports).to.deep.equal(['dumb.js', 'dumber.js', 'jeff.js', 'jim.js']);
    done();
  });

  it('can read a single line block import stmnt', (done) => {
    let scripts = ["/*!import dumb.js, dumber.js,\tjeff.js,    jim.js*/\r\nvar jake = (() => {\r\n  return {\r\n    name: 'jake',\r\n    isADog: 'true'\r\n  };\r\n}());"];
    let imports = LibImport.scan(scripts);
    expect(imports.length).to.equal(4);
    expect(imports).to.deep.equal(['dumb.js', 'dumber.js', 'jeff.js', 'jim.js']);
    done();
  });

  it('can read a multi line block import stmnt', (done) => {
    let scripts = ["/*\n\n!import dumb, dumber,\tjeff,    jim*/\r\nvar jake = (() => {\r\n  return {\r\n    name: 'jake',\r\n    isADog: 'true'\r\n  };\r\n}());"];
    let imports = LibImport.scan(scripts);
    expect(imports.length).to.equal(4);
    expect(imports).to.deep.equal(['dumb', 'dumber', 'jeff', 'jim']);
    done();
  });

  it('can read multiple import stmnts in a block', (done) => {
    let scripts = ["/*!import dumb\n !import dumber\n\t!import jeff\n   !import jim*/\r\nvar jake = (() => {\r\n  return {\r\n    name: 'jake',\r\n    isADog: 'true'\r\n  };\r\n}());"];
    let imports = LibImport.scan(scripts);
    expect(imports.length).to.equal(4);
    expect(imports).to.deep.equal(['dumb', 'dumber', 'jeff', 'jim']);
    done();
  });
});

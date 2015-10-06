/*jshint expr: true*/
let expect = require('chai').expect;
let appx = require('../lib/appx-test-support');

describe('appx-test-support', () => {
  it('correctly loads a vanilla script', (done) => {
    let ctx = appx.requireLocal('./test/resources/vanilla/jake.js');
    let jake = appx.requireRest('./test/resources/vanilla/jake.js', 'jake');
    expect(ctx).to.be.defined;
    expect(ctx.jake).to.deep.equal(jake);
    expect(jake.isADog).to.be.ok;
    done();
  });

  it('correctly loads a directory of vanilla', (done) => {
    let ctx = appx.requireLocal('./test/resources/vanilla');
    let jake = appx.requireRest('./test/resources/vanilla/jake.js', 'jake');
    expect(ctx).to.be.defined;
    expect(ctx.jake).to.be.defined;
    expect(ctx.jake).to.deep.equal(jake);
    done();
  });

  it('correctly loads a script that has imports', (done) => {
    let ctx = appx.requireLocal('./test/resources/libimport/jake.js');
    expect(ctx.adventure).to.be.defined;
    done();
  });

});

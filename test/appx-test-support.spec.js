/*jshint expr: true*/
let expect = require('chai').expect;
let appx = require('../lib/appx-test-support');

describe('appx-test-support', () => {
  it('correctly loads a vanilla script', (done) => {
    let ctx = appx.requireLocal('../test/resources/jake.js');
    let jake = appx.requireRest('../test/resources/jake.js', 'jake');
    expect(ctx).to.be.defined;
    expect(ctx.jake).to.deep.equal(jake);
    expect(jake.isADog).to.be.ok;
    done();
  });

  it('correctly loads a directory of vanilla', (done) => {
    let ctx = appx.requireLocal('../test/resources');
    let jake = appx.requireRest('../test/resources/jake.js', 'jake');
    expect(ctx).to.be.defined;
    expect(ctx.jake).to.be.defined;
    expect(ctx.jake).to.deep.equal(jake);
    done();
  });

});

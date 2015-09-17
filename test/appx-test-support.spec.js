/*jshint expr: true*/
var expect = require('chai').expect;
var appx = require('../lib/appx-test-support');

describe('appx-test-support', () => {
  it('correctly loads a vanilla script', (done) => {
    var ctx = appx.requireLocal('../test/resources/jake.js');
    var jake = appx.requireRest('../test/resources/jake.js', 'jake');
    expect(ctx).to.be.defined;
    expect(ctx.jake).to.deep.equal(jake);
    expect(jake.isADog).to.be.ok;
    done();
  });

  it('correctly loads a directory of vanilla', (done) => {
    var ctx = appx.requireLocal('../test/resources');
    var jake = appx.requireRest('../test/resources/jake.js', 'jake');
    expect(ctx).to.be.defined;
    expect(ctx.jake).to.be.defined;
    expect(ctx.jake).to.deep.equal(jake);
    done();
  });

});

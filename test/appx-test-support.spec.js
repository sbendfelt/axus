/*jshint expr: true*/
const expect = require('chai').expect;
const axus = require('../lib/appx-test-support');

describe('axus-test-support', () => {
  it('correctly loads a vanilla script', (done) => {
    let ctx = axus.requireLocal('./test/resources/vanilla/jake.js').seed();
    let jake = axus.requireRest('./test/resources/vanilla/jake.js', 'jake');
    expect(ctx).to.be.defined;
    expect(jake).to.be.defined;
    expect(ctx.jake).to.deep.equal(jake);
    expect(jake.isADog).to.be.ok;
    done();
  });

  it('correctly loads a directory of vanilla', (done) => {
    let ctx = axus.requireLocal('./test/resources/vanilla').seed();
    let jake = axus.requireRest('./test/resources/vanilla/jake.js', 'jake');
    expect(ctx).to.be.defined;
    expect(ctx.jake).to.be.defined;
    expect(ctx.jake).to.deep.equal(jake);
    done();
  });

  it('correctly loads a script after overrideLib', (done) => {
    let ctx = axus
      .overrideLib('./test/resources/vanilla/')
      .requireLocal('./test/resources/libimport/jake.js');
    expect(ctx.adventure).to.be.defined;
    done();
  });

  it('correctly loads a module directory', (done) => {
    let ctx = axus.requireLocal('./test/resources/testModule').seed();
    expect(ctx).to.be.defined;
    done();
  });

  it('contextualizes providers.', (done) => {
    let ctx = axus
      .requireLocal('./test/resources/vanilla/loginfo.js')
      .seed();
    let ctx2 = axus
      .requireLocal('./test/resources/vanilla/loginfo.js')
      .seed();
    ctx.info();
    let msgs = ctx.Providers.getMessageProvider().getMessages();
    expect(msgs.length).to.equal(1);
    expect(ctx2.Providers.getMessageProvider().getMessages().length).to.not.be.ok;
    done();
  });


});

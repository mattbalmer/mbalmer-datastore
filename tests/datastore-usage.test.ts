import 'mocha';
import { expect } from 'chai';
import * as sinon_ from 'sinon';
import { Datastore, notifyCallback } from '../source/datastore';

const sinon = (sinon_ as sinon_.SinonApi);

interface MockData {
  foo: string;
  derp: {
    a: number;
    b: number;
    c: {
      hello: string;
    }
  }
  list: string[];
}

let mock: MockData = {
  foo: 'bar',
  derp: {
    a: 1,
    b: 2,
    c: {
      hello: 'world'
    },
  },
  list: ['a', 'b', 'c'],
};

describe(`Datastore - Usage`, () => {
  let store;
  let cb;

  beforeEach(() => {
    store = new Datastore<MockData>(mock);
    cb = sinon.fake();
  });

  it(`sub() | set: derp.c.hello > goodbye`, () => {
    store.subscribe(cb);

    store.set('derp.c.hello', 'goodbye');

    expect(cb.calledOnce).to.be.true;
    expect(cb.getCall(0).args).to.deep.equal(['derp.c.hello', 'goodbye', 'world', 'set']);
  });

  it(`sub('derp') | set: derp.c.hello > goodbye`, () => {
    store.subscribe('derp', cb);

    store.set('derp.c.hello', 'goodbye');

    expect(cb.calledOnce).to.be.true;
    expect(cb.getCall(0).args).to.deep.equal(['derp.c.hello', 'goodbye', 'world', 'set']);
  });

  it(`sub('foo') | set: derp.c.hello > goodbye`, () => {
    store.subscribe('foo', cb);

    store.set('derp.c.hello', 'goodbye');

    expect(cb.calledOnce).to.be.false;
  });

  it(`sub('derp.a') | set: derp.c.hello > goodbye`, () => {
    store.subscribe('derp.a', cb);

    store.set('derp.c.hello', 'goodbye');

    expect(cb.calledOnce).to.be.false;
  });

  it(`sub('derp.a') | set: derp.c.hello > goodbye`, () => {
    store.subscribe('derp.c', 'set', cb);

    store.set('derp.c.hello', 'goodbye');

    expect(cb.calledOnce).to.be.true;
    expect(cb.getCall(0).args).to.deep.equal(['derp.c.hello', 'goodbye', 'world', 'set']);
  });

  it(`sub('derp.a') | update: derp.c.hello > goodbye`, () => {
    store.subscribe('derp.c.hello', 'set', cb);

    store.update('derp.c.hello', 'goodbye');

    expect(cb.calledOnce).to.be.false;
  });
});
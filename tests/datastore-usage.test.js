"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const sinon_ = require("sinon");
const datastore_1 = require("../source/datastore");
const sinon = sinon_;
let mock = {
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
        store = new datastore_1.Datastore(mock);
        cb = sinon.fake();
    });
    it(`sub() | set: derp.c.hello > goodbye`, () => {
        store.subscribe(cb);
        store.set('derp.c.hello', 'goodbye');
        chai_1.expect(cb.calledOnce).to.be.true;
        chai_1.expect(cb.getCall(0).args).to.deep.equal(['derp.c.hello', 'goodbye', 'world', 'set']);
    });
    it(`sub('derp') | set: derp.c.hello > goodbye`, () => {
        store.subscribe('derp', cb);
        store.set('derp.c.hello', 'goodbye');
        chai_1.expect(cb.calledOnce).to.be.true;
        chai_1.expect(cb.getCall(0).args).to.deep.equal(['derp.c.hello', 'goodbye', 'world', 'set']);
    });
    it(`sub('foo') | set: derp.c.hello > goodbye`, () => {
        store.subscribe('foo', cb);
        store.set('derp.c.hello', 'goodbye');
        chai_1.expect(cb.calledOnce).to.be.false;
    });
    it(`sub('derp.a') | set: derp.c.hello > goodbye`, () => {
        store.subscribe('derp.a', cb);
        store.set('derp.c.hello', 'goodbye');
        chai_1.expect(cb.calledOnce).to.be.false;
    });
    it(`sub('derp.a') | set: derp.c.hello > goodbye`, () => {
        store.subscribe('derp.c', 'set', cb);
        store.set('derp.c.hello', 'goodbye');
        chai_1.expect(cb.calledOnce).to.be.true;
        chai_1.expect(cb.getCall(0).args).to.deep.equal(['derp.c.hello', 'goodbye', 'world', 'set']);
    });
    it(`sub('derp.a') | update: derp.c.hello > goodbye`, () => {
        store.subscribe('derp.c.hello', 'set', cb);
        store.update('derp.c.hello', 'goodbye');
        chai_1.expect(cb.calledOnce).to.be.false;
    });
});
//# sourceMappingURL=datastore-usage.test.js.map
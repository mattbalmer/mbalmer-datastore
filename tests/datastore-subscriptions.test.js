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
describe(`Datastore - Subscriptions`, () => {
    describe(`subscribe()`, () => {
        it(`should add the callback to the list of subscribers`, () => {
            let store = new datastore_1.Datastore(mock);
            chai_1.expect(store['subscribers'].length).to.deep.equal(0);
            store.subscribe(() => { });
            chai_1.expect(store['subscribers'].length).to.deep.equal(1);
        });
        it(`should be given a unique ID`, () => {
            let store = new datastore_1.Datastore(mock);
            let cb1 = () => { };
            let cb2 = () => { };
            store.subscribe(cb1);
            store.subscribe(cb2);
            chai_1.expect(cb1._callbackID).to.deep.equal(0);
            chai_1.expect(cb2._callbackID).to.deep.equal(1);
        });
    });
    describe(`unsubscribe()`, () => {
        it(`should remove the callback from the list of subscribers`, () => {
            let store = new datastore_1.Datastore(mock);
            let cb = () => { };
            store.subscribe(cb);
            chai_1.expect(store['subscribers'].length).to.deep.equal(1);
            store.unsubscribe(cb);
            chai_1.expect(store['subscribers'].length).to.deep.equal(0);
        });
    });
    describe(`notify()`, () => {
        it(`should pass along all parameters to all callbacks`, () => {
            let store = new datastore_1.Datastore(mock);
            let [path, newVal, oldVal, operation, delta, pos] = ['path_', 'newVal_', 'oldVal_', 'operation_', 'delta_', -1];
            let cb1 = (_path, _newVal, _oldVal, _operation, _delta, _pos) => {
                chai_1.expect(_path).to.deep.equal(path);
                chai_1.expect(_newVal).to.deep.equal(newVal);
                chai_1.expect(_oldVal).to.deep.equal(oldVal);
                chai_1.expect(_operation).to.deep.equal(operation);
                chai_1.expect(_delta).to.deep.equal([delta]);
                chai_1.expect(_pos).to.deep.equal(pos);
            };
            let cb2 = (_path, _newVal, _oldVal, _operation, _delta, _pos) => {
                chai_1.expect(_path).to.deep.equal(path);
                chai_1.expect(_newVal).to.deep.equal(newVal);
                chai_1.expect(_oldVal).to.deep.equal(oldVal);
                chai_1.expect(_operation).to.deep.equal(operation);
                chai_1.expect(_delta).to.deep.equal([delta]);
                chai_1.expect(_pos).to.deep.equal(pos);
            };
            store.subscribe(cb1);
            store.subscribe(cb2);
            store.notify(path, newVal, oldVal, operation, [delta], pos);
        });
        const notifyTest = (desc, fn) => {
            it(desc, () => {
                let store = new datastore_1.Datastore(mock);
                let cb = sinon.fake();
                store.subscribe(cb);
                fn(store);
                chai_1.expect(cb.calledOnce).to.be.true;
            });
        };
        notifyTest('should notify for set()', (store) => {
            store.set('foo', 'bar2');
        });
        notifyTest('should notify for update()', (store) => {
            store.update('foo', 'bar2');
        });
        notifyTest('should notify for insert()', (store) => {
            store.insert('list', 'f');
        });
        notifyTest('should notify for insert() - batch mode', (store) => {
            store.insert('list', ['f', 'z']);
        });
    });
    describe('set() callback', () => {
        it(`should call with path, newVal, oldVal, and 'set'`, () => {
            let store = new datastore_1.Datastore(mock);
            let cb = sinon.fake();
            store.subscribe(cb);
            store.set('foo', 'foobar');
            chai_1.expect(cb.calledOnce).to.be.true;
            chai_1.expect(cb.getCall(0).args).to.deep.equal(['foo', 'foobar', 'bar', 'set']);
        });
        it(`should call with undefined if not previously set`, () => {
            let store = new datastore_1.Datastore(mock);
            let cb = sinon.fake();
            store.subscribe(cb);
            store.set('notset', 'foobar');
            chai_1.expect(cb.calledOnce).to.be.true;
            chai_1.expect(cb.getCall(0).args).to.deep.equal(['notset', 'foobar', undefined, 'set']);
        });
    });
    describe('update() callback', () => {
        it(`should call with path, newVal, oldVal, and 'update'`, () => {
            let store = new datastore_1.Datastore(mock);
            let cb = sinon.fake();
            store.subscribe(cb);
            store.update('foo', 'foobar');
            chai_1.expect(cb.calledOnce).to.be.true;
            chai_1.expect(cb.getCall(0).args).to.deep.equal(['foo', 'foobar', 'bar', 'update']);
        });
    });
    describe('insert() callback', () => {
        it(`should call with path, newVal, oldVal, 'insert', and delta`, () => {
            let store = new datastore_1.Datastore(mock);
            let cb = sinon.fake();
            store.subscribe(cb);
            store.insert('list', ['x', 'y']);
            chai_1.expect(cb.calledOnce).to.be.true;
            chai_1.expect(cb.getCall(0).args).to.deep.equal([
                'list',
                ['a', 'b', 'c', 'x', 'y'],
                ['a', 'b', 'c'],
                'insert',
                ['x', 'y'],
                -1
            ]);
        });
        it(`should wrap the value if necessary`, () => {
            let store = new datastore_1.Datastore(mock);
            let cb = sinon.fake();
            store.subscribe(cb);
            store.insert('list', 'x');
            chai_1.expect(cb.calledOnce).to.be.true;
            chai_1.expect(cb.getCall(0).args).to.deep.equal([
                'list',
                ['a', 'b', 'c', 'x'],
                ['a', 'b', 'c'],
                'insert',
                ['x'],
                -1
            ]);
        });
    });
});
//# sourceMappingURL=datastore-subscriptions.test.js.map
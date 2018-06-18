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

describe(`Datastore - Subscriptions`, () => {

  describe(`subscribe()`, () => {
    it(`should add the callback to the list of subscribers`, () => {
      let store = new Datastore<MockData>(mock);

      expect(store['subscribers'].length).to.deep.equal(0);

      store.subscribe(()=>{});

      expect(store['subscribers'].length).to.deep.equal(1);
    });
    
    it(`should be given a unique ID`, () => {
      let store = new Datastore<MockData>(mock);
      let cb1: notifyCallback = ()=>{};
      let cb2: notifyCallback= ()=>{};

      store.subscribe(cb1);
      store.subscribe(cb2);

      expect(cb1._callbackID).to.deep.equal(0);
      expect(cb2._callbackID).to.deep.equal(1);
    });
  });

  describe(`unsubscribe()`, () => {
    it(`should remove the callback from the list of subscribers`, () => {
      let store = new Datastore<MockData>(mock);
      let cb = ()=>{};

      store.subscribe(cb);
      expect(store['subscribers'].length).to.deep.equal(1);

      store.unsubscribe(cb);

      expect(store['subscribers'].length).to.deep.equal(0);
    });
  });

  describe(`notify()`, () => {
    it(`should pass along all parameters to all callbacks`, () => {
      let store = new Datastore<MockData>(mock);
      
      let [path, newVal, oldVal, operation, delta, pos] =
          ['path_', 'newVal_', 'oldVal_', 'operation_', 'delta_', -1];
      
      let cb1 = (_path, _newVal, _oldVal, _operation, _delta, _pos) => {
        expect(_path).to.deep.equal(path);
        expect(_newVal).to.deep.equal(newVal);
        expect(_oldVal).to.deep.equal(oldVal);
        expect(_operation).to.deep.equal(operation);
        expect(_delta).to.deep.equal([delta]);
        expect(_pos).to.deep.equal(pos);
      };

      let cb2 = (_path, _newVal, _oldVal, _operation, _delta, _pos) => {
        expect(_path).to.deep.equal(path);
        expect(_newVal).to.deep.equal(newVal);
        expect(_oldVal).to.deep.equal(oldVal);
        expect(_operation).to.deep.equal(operation);
        expect(_delta).to.deep.equal([delta]);
        expect(_pos).to.deep.equal(pos);
      };

      store.subscribe(cb1);
      store.subscribe(cb2);
      store.notify(path, newVal, oldVal, operation, [delta], pos);
    });

    const notifyTest = (desc, fn) => {
      it(desc, () => {
        let store = new Datastore<MockData>(mock);
        let cb = sinon.fake();
        store.subscribe(cb);

        fn(store);

        expect(cb.calledOnce).to.be.true;
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
      let store = new Datastore<MockData>(mock);
      let cb = sinon.fake();
      store.subscribe(cb);

      store.set('foo', 'foobar');

      expect(cb.calledOnce).to.be.true;
      expect(cb.getCall(0).args).to.deep.equal(['foo', 'foobar', 'bar', 'set']);
    });

    it(`should call with undefined if not previously set`, () => {
      let store = new Datastore<MockData>(mock);
      let cb = sinon.fake();
      store.subscribe(cb);

      store.set('notset', 'foobar');

      expect(cb.calledOnce).to.be.true;
      expect(cb.getCall(0).args).to.deep.equal(['notset', 'foobar', undefined, 'set']);
    });
  });

  describe('update() callback', () => {
    it(`should call with path, newVal, oldVal, and 'update'`, () => {
      let store = new Datastore<MockData>(mock);
      let cb = sinon.fake();
      store.subscribe(cb);

      store.update('foo', 'foobar');

      expect(cb.calledOnce).to.be.true;
      expect(cb.getCall(0).args).to.deep.equal(['foo', 'foobar', 'bar', 'update']);
    });
  });

  describe('insert() callback', () => {
    it(`should call with path, newVal, oldVal, 'insert', and delta`, () => {
      let store = new Datastore<MockData>(mock);
      let cb = sinon.fake();
      store.subscribe(cb);

      store.insert('list', ['x', 'y']);

      expect(cb.calledOnce).to.be.true;
      expect(cb.getCall(0).args).to.deep.equal([
        'list',
        ['a', 'b', 'c', 'x', 'y'],
        ['a', 'b', 'c'],
        'insert',
        ['x', 'y'],
        -1
      ]);
    });

    it(`should wrap the value if necessary`, () => {
      let store = new Datastore<MockData>(mock);
      let cb = sinon.fake();
      store.subscribe(cb);

      store.insert('list', 'x');

      expect(cb.calledOnce).to.be.true;
      expect(cb.getCall(0).args).to.deep.equal([
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
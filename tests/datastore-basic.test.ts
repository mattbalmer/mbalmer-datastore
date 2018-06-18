import 'mocha';
import { expect } from 'chai';
import { Datastore } from '../source/datastore';

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

describe(`Datastore - Basics`, () => {

  describe(`constructor`, () => {
    it(`should set a default data`, () => {
      let store = new Datastore();

      expect(store.data).to.deep.equal({});
    });

    it(`should take a given initial data structure`, () => {
      let store = new Datastore(mock);

      expect(store.data).to.deep.equal(mock);
    });
  });

  describe(`exists()`, () => {
    it(`should return false for a key that does not exist`, () => {
      let store = new Datastore<MockData>(mock);

      expect(store.exists('fakepath')).to.deep.equal(false);
    });

    it(`should return true for a key that does exist`, () => {
      let store = new Datastore<MockData>(mock);

      expect(store.exists('derp.a')).to.deep.equal(true);
    });
  });

  describe(`get()`, () => {
    it(`should return the value for the path requested`, () => {
      let store = new Datastore<MockData>(mock);

      expect(store.get('foo')).to.deep.equal(mock.foo);
    });

    it(`should handle nested values`, () => {
      let store = new Datastore<MockData>(mock);

      expect(store.get('doesNotExist', 'doesNotExist')).to.deep.equal('doesNotExist');
    });

    it(`should give a default value`, () => {
      let store = new Datastore<MockData>(mock);

      expect(store.get('derp.b')).to.deep.equal(mock.derp.b);
    });
  });

  describe(`set()`, () => {
    it(`should change an existing value`, () => {
      let store = new Datastore<MockData>(mock);

      expect(store.get('foo')).to.deep.equal(mock.foo);

      store.set('foo', 'newvalue');

      expect(store.get('foo')).to.deep.equal('newvalue');
    });

    it(`should add a new value`, () => {
      let store = new Datastore<MockData>(mock);

      expect(store.exists('newkey')).to.deep.equal(false);

      store.set('newkey', 'newvalue');

      expect(store.get('newkey')).to.deep.equal('newvalue');
    });

    it(`should not modify the original object`, () => {
      let store = new Datastore<MockData>(mock);

      store.set('derp.c.goodbye', 'sun');

      expect(mock.derp.c['goodbye']).to.deep.equal(undefined);
    });
  });

  describe(`update()`, () => {
    it(`should change an existing value`, () => {
      let store = new Datastore<MockData>(mock);

      expect(store.get('foo')).to.deep.equal(mock.foo);

      store.update('foo', 'newvalue');

      expect(store.get('foo')).to.deep.equal('newvalue');
    });

    it(`should throw an error when trying to add new values`, () => {
      let store = new Datastore<MockData>(mock);

      expect(store.exists('newkey')).to.deep.equal(false);

      try {
        store.update('newkey', 'newvalue');
      } catch(e) {
        expect(e).to.deep.equal(`Cannot update path 'newkey', as it does not exist.`);
      }
    });

    it(`should add new values if force flag is enabled`, () => {
      let store = new Datastore<MockData>(mock);

      expect(store.exists('newkey')).to.deep.equal(false);

      store.update('newkey', 'newvalue', true);

      expect(store.get('newkey')).to.deep.equal('newvalue');
    });
  });

  describe(`insert()`, () => {
    it(`should append an item`, () => {
      let store = new Datastore<MockData>(mock);

      expect(store.get('list')).to.deep.equal(mock.list);

      store.insert('list', 'd');

      expect(store.get('list')).to.deep.equal(['a', 'b', 'c', 'd']);
    });

    describe('positional inserts', () => {
      const insertAt = (desc, index, expected) => {
        it(desc, () => {
          let store = new Datastore<MockData>(mock);
          expect(store.get('list')).to.deep.equal(mock.list);
          store.insert('list', 'd', index);
          expect(store.get('list')).to.deep.equal(expected);
        });
      };
      
      insertAt(`should insert an item at index 0`, 0, ['d', 'a', 'b', 'c']);

      insertAt(`should insert an item at index 1`, 1, ['a', 'd', 'b', 'c']);

      insertAt(`should insert an item at index -2`, -2, ['a', 'b', 'd', 'c']);
    });
    
    it('should throw an error when inserting into a non-array value', () => {
      let store = new Datastore<MockData>(mock);

      try {
        store.insert('foo', 'd');
      } catch(e) {
        expect(e).to.deep.equal(`Cannot insert into a non-array value at 'foo'.`);
      }
    });
  });
  
  describe(`insert() - batch mode`, () => {
    it(`should append multiple items`, () => {
      let store = new Datastore<MockData>(mock);

      expect(store.get('list')).to.deep.equal(mock.list);

      store.insert('list', ['d', 'e']);

      expect(store.get('list')).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
    });

    describe('positional inserts', () => {
      const insertAt = (desc, index, expected) => {
        it(desc, () => {
          let store = new Datastore<MockData>(mock);
          expect(store.get('list')).to.deep.equal(mock.list);
          store.insert('list', ['d', 'e'], index);
          expect(store.get('list')).to.deep.equal(expected);
        });
      };
      
      insertAt(`should insert an item at index 0`, 0, ['d', 'e', 'a', 'b', 'c']);

      insertAt(`should insert an item at index 1`, 1, ['a', 'd', 'e', 'b', 'c']);

      insertAt(`should insert an item at index -2`, -2, ['a', 'b', 'd', 'e', 'c']);
    });
    
    it('should throw an error when inserting into a non-array value', () => {
      let store = new Datastore<MockData>(mock);

      try {
        store.insert('foo', ['d']);
      } catch(e) {
        expect(e).to.deep.equal(`Cannot insert into a non-array value at 'foo'.`);
      }
    });
  });
});
import 'mocha';
import { expect } from 'chai';
import { retrieve, assign, pathsFor } from '../source/fn';

let mock = null;

describe(`functions`, () => {

  beforeEach(() => {
    mock = {
      foo: 'bar',
      derp: {
        a: 1,
        b: 2
      }
    };
  });

  describe(`retrieve`, () => {
    it(`should get the pathed object`, () => {
      let res = retrieve(mock, 'derp');

      expect(res).to.deep.equal(mock.derp);
    });

    it(`should get the pathed object`, () => {
      let res = retrieve(mock, 'derp.a');

      expect(res).to.deep.equal(mock.derp.a);
    });
  });

  describe(`assign`, () => {
    it(`should get the pathed object`, () => {
      let data = {
        ein: 1,
        foo: 'bar'
      };

      assign(mock, 'foo', data);
      let res = retrieve(mock, 'foo');

      expect(res).to.deep.equal(data);
    });

    it(`should get the pathed object`, () => {
      let data = {
        ein: 1,
        foo: 'bar'
      };

      assign(mock, 'derp.a', data);
      let res = retrieve(mock, 'derp.a');

      expect(res).to.deep.equal(data);
    });
  });

  describe(`pathsFor`, () => {
    it(`should return all paths that lead to the path`, () => {
      let path = 'foo.bar.d.sd';

      let paths = pathsFor(path);

      expect(paths).to.deep.equal(['foo', 'foo.bar', 'foo.bar.d', 'foo.bar.d.sd']);
    });
  });
});
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const fn_1 = require("../source/fn");
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
            let res = fn_1.retrieve(mock, 'derp');
            chai_1.expect(res).to.deep.equal(mock.derp);
        });
        it(`should get the pathed object`, () => {
            let res = fn_1.retrieve(mock, 'derp.a');
            chai_1.expect(res).to.deep.equal(mock.derp.a);
        });
    });
    describe(`assign`, () => {
        it(`should get the pathed object`, () => {
            let data = {
                ein: 1,
                foo: 'bar'
            };
            fn_1.assign(mock, 'foo', data);
            let res = fn_1.retrieve(mock, 'foo');
            chai_1.expect(res).to.deep.equal(data);
        });
        it(`should get the pathed object`, () => {
            let data = {
                ein: 1,
                foo: 'bar'
            };
            fn_1.assign(mock, 'derp.a', data);
            let res = fn_1.retrieve(mock, 'derp.a');
            chai_1.expect(res).to.deep.equal(data);
        });
    });
    describe(`pathsFor`, () => {
        it(`should return all paths that lead to the path`, () => {
            let path = 'foo.bar.d.sd';
            let paths = fn_1.pathsFor(path);
            chai_1.expect(paths).to.deep.equal(['foo', 'foo.bar', 'foo.bar.d', 'foo.bar.d.sd']);
        });
    });
});
//# sourceMappingURL=fn.test.js.map
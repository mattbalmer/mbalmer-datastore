"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pathsFor(path) {
    return path
        .split('.')
        .map((part, i, paths) => paths.slice(0, i + 1).join('.'));
}
exports.pathsFor = pathsFor;
function exists(source, path) {
    if (path.indexOf('.') < 0) {
        return source.hasOwnProperty(path);
    }
    else {
        let parts = path.split('.');
        let [head, tail] = [parts[0], parts.slice(1).join('.')];
        return exists(source[head], tail);
    }
}
exports.exists = exists;
function retrieve(source, path) {
    if (path.indexOf('.') < 0) {
        return source[path];
    }
    else {
        let parts = path.split('.');
        return retrieve(source[parts[0]], parts.slice(1).join('.'));
    }
}
exports.retrieve = retrieve;
function assign(source, path, data) {
    if (path.indexOf('.') < 0) {
        return source[path] = data;
    }
    else {
        let parts = path.split('.');
        return assign(source[parts[0]], parts.slice(1).join('.'), data);
    }
}
exports.assign = assign;
//# sourceMappingURL=fn.js.map
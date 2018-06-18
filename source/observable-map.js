"use strict";
const fn_1 = require('./fn');
class ObservableMap {
    constructor(initialData) {
        this.data = {};
        this.subscribers = [];
        this.data = initialData || {};
    }
    get(path) {
        return path ? fn_1.retrieve(this.data, path) : this.data;
    }
    set(path, data) {
        fn_1.assign(this.data, path, data);
    }
    subscribe(path, callback, context) {
        let subscriber = { path, callback };
        if (context) {
            subscriber.context = context;
        }
        this.subscribers.push(subscriber);
    }
    subscribersFor(path) {
        let paths = fn_1.pathsFor(path);
        return this.subscribers
            .filter(sub => paths.indexOf(sub.path) > -1);
    }
    trigger(path, data) {
        let subscribers = this.subscribersFor(path);
        subscribers
            .forEach(sub => {
            let event = { path, data };
            sub.callback.call(sub.context || null, event);
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ObservableMap;
//# sourceMappingURL=observable-map.js.map
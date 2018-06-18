"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fn_1 = require("./fn");
class Datastore {
    constructor(data) {
        this.nextCallbackId = 0;
        this.subscribers = [];
        this.data = data
            ? JSON.parse(JSON.stringify(data))
            : {};
    }
    exists(path) {
        return fn_1.exists(this.data, path);
    }
    get(path, default_ = undefined) {
        if (this.exists(path)) {
            return fn_1.retrieve(this.data, path);
        }
        else {
            return default_;
        }
    }
    set(path, value) {
        let oldVal = fn_1.retrieve(this.data, path);
        let newVal = fn_1.assign(this.data, path, value);
        this.notify(path, newVal, oldVal, 'set');
    }
    update(path, value, forceSet = false) {
        if (this.exists(path)) {
            let oldVal = this.data[path];
            let newVal = fn_1.assign(this.data, path, value);
            this.notify(path, newVal, oldVal, 'update');
        }
        else if (forceSet) {
            this.set(path, value);
        }
        else {
            throw `Cannot update path '${path}', as it does not exist.`;
        }
    }
    insert(path, values, pos = -1) {
        if (Array.isArray(this.data[path])) {
            if (!Array.isArray(values)) {
                values = [values];
            }
            let oldVal = fn_1.retrieve(this.data, path);
            let newVal = oldVal.slice(0);
            if (pos === 0) {
                newVal = [...values, ...newVal];
            }
            else if (pos === -1) {
                newVal = [...newVal, ...values];
            }
            else {
                const i = pos > 0
                    ? pos
                    : (newVal.length + 1 + pos);
                newVal.splice(i, 0, ...values);
            }
            fn_1.assign(this.data, path, newVal);
            this.notify(path, newVal, oldVal, 'insert', values, pos);
        }
        else {
            throw `Cannot insert into a non-array value at '${path}'.`;
        }
    }
    subscribe(arg0, arg1, arg2) {
        const path = (typeof arg0 === 'string' ? arg0 : null);
        const operation = (typeof arg1 === 'string' ? arg1 : null);
        const callback = (typeof arg2 === 'function' ? arg2 : (typeof arg1 === 'function' ? arg1 : arg0));
        callback['_callbackID'] = this.nextCallbackId++;
        callback['_callbackPath'] = typeof path === 'string' ? new RegExp(path) : path;
        callback['_callbackOperation'] = operation;
        this.subscribers.push(callback);
    }
    unsubscribe(callback) {
        let callbackID = typeof callback === 'number'
            ? callback
            : callback._callbackID;
        let i = this.subscribers.findIndex((callback_) => callback_._callbackID == callbackID);
        this.subscribers.splice(i, 1);
    }
    notify(path, newVal, oldVal, operation, delta, pos) {
        this.subscribers
            .filter(subscriber => {
            return (!subscriber._callbackPath || subscriber._callbackPath.test(path))
                && (!subscriber._callbackOperation || subscriber._callbackOperation === operation);
        })
            .forEach(callback => {
            if (arguments.length === 6) {
                callback(path, newVal, oldVal, operation, delta, pos);
            }
            else if (arguments.length === 5) {
                callback(path, newVal, oldVal, operation, delta);
            }
            else {
                callback(path, newVal, oldVal, operation);
            }
        });
    }
}
exports.Datastore = Datastore;
//# sourceMappingURL=datastore.js.map
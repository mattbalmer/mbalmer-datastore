import { exists, retrieve, assign } from './fn';

export interface notifyCallback {
  (path: string, newVal: any, oldVal: any, operation: string, delta?: any[], pos?: number): void
  _callbackID?: number;
  _callbackPath?: RegExp;
  _callbackOperation?: string;
}

class Datastore<T extends object = object> {
  data: T;
  nextCallbackId: number = 0;

  private subscribers: notifyCallback[] = [];

  /**
   * Creates a new datastore
   * @param {T} data
   */
  constructor(data?: T) {
    this.data = data
      ? JSON.parse(JSON.stringify(data))
      : ({} as T);
  }

  /**
   * Determines whether or not a path exists in the datastore.
   * @param {string} path
   * @returns {boolean}
   */
  exists(path: string): boolean {
    return exists(this.data, path);
  }

  /**
   * Returns the value for a given path in the datastore
   * @param {string} path
   * @param {*} default_ the default value if the path does not exist
   * @returns {any}
   */
  get(path: string, default_: any = undefined): any {
    if(this.exists(path)) {
      return retrieve(this.data, path);
    } else {
      return default_;
    }
  }

  /**
   * Sets the value at a given path.
   *
   * Triggers subscribers with (path, value, oldValue, 'set')
   *
   * @param {string} path
   * @param {*} value
   */
  set(path: string, value: any) {
    let oldVal = retrieve(this.data, path);
    let newVal = assign(this.data, path, value);
    this.notify(path, newVal, oldVal, 'set');
  }

  /**
   * Updates an existing value.
   *
   * Triggers subscribers with (path, value, oldValue, 'update')
   *
   * If forceSet is true, will call set instead.
   *
   * @param {string} path
   * @param {*} value
   * @param {boolean} [forceSet=false]
   */
  update(path: string, value: any, forceSet: boolean = false) {
    if(this.exists(path)) {
      let oldVal = this.data[path];
      let newVal = assign(this.data, path, value);
      this.notify(path, newVal, oldVal, 'update');
    } else if(forceSet) {
      this.set(path, value);
    } else {
      throw `Cannot update path '${path}', as it does not exist.`
    }
  }

  /**
   * Inserts values into an array.
   *
   * Triggers subscribers with (path, newValue, oldValue, 'insert', delta, position)
   *
   * @param {string} path
   * @param {* | *[]} values
   * @param {number} [pos=-1]
   */
  insert(path: string, values: any|any[], pos: number = -1) {
    if(Array.isArray(this.data[path])) {
      if(!Array.isArray(values)) {
        values = [values];
      }
      let oldVal = retrieve(this.data, path);
      let newVal = oldVal.slice(0);
      if(pos === 0) {
        newVal = [...values, ...newVal];
      } else if(pos === -1) {
        newVal = [...newVal, ...values];
      } else {
        const i = pos > 0
          ? pos
          : (newVal.length + 1 + pos);
        newVal.splice(i, 0, ...values);
      }
      assign(this.data, path, newVal);
      this.notify(path, newVal, oldVal, 'insert', values, pos);
    } else {
      throw `Cannot insert into a non-array value at '${path}'.`
    }
  }

  /**
   * Register a callback as a subscriber in the datatore.
   *
   * @param {string|RegExp|notifyCallback} callback|path Either the callback, or the path to listen to.
   * @param {string|notifyCallback} [callback|operation] Either the callback, or the operation to listen to.
   * @param {notifyCallback} [callback] The callback
   */
  subscribe(callback: notifyCallback);
  subscribe(path: string|RegExp, callback: notifyCallback);
  subscribe(path: string|RegExp, operation: string, callback: notifyCallback);
  subscribe(arg0: string|RegExp|notifyCallback, arg1?: string|notifyCallback, arg2?: notifyCallback) {
    const path: string|RegExp = (typeof arg0 === 'string' ? arg0 : null) as string|RegExp;
    const operation: string = (typeof arg1 === 'string' ? arg1 : null) as string;
    const callback: notifyCallback = (typeof arg2 === 'function' ? arg2 : (typeof arg1 === 'function' ? arg1 : arg0)) as notifyCallback;

    callback['_callbackID'] = this.nextCallbackId++;
    callback['_callbackPath'] = typeof path === 'string' ? new RegExp(path) : path;
    callback['_callbackOperation'] = operation;
    this.subscribers.push(callback);
  }

  /**
   * De-register a callback as a subscriber.
   * @param {notifyCallback | number} callback or callbackID
   */
  unsubscribe(callback: notifyCallback|number) {
    let callbackID = typeof callback === 'number'
      ? callback
      : callback._callbackID;
    let i = this.subscribers.findIndex((callback_: notifyCallback) => callback_._callbackID == callbackID);
    this.subscribers.splice(i, 1);
  }

  /**
   * Notifies all subscribers with the given data.
   *
   * @param {string} path
   * @param {*} newVal
   * @param {*} oldVal
   * @param {string} operation
   * @param {any[]} [delta]
   * @param {number} [pos]
   */
  notify(path: string, newVal: any, oldVal: any, operation: string, delta?: any[], pos?: number) {
    this.subscribers
      .filter(subscriber => {
        return (!subscriber._callbackPath || subscriber._callbackPath.test(path))
          && (!subscriber._callbackOperation || subscriber._callbackOperation === operation);
      })
      .forEach(callback => {
        if(arguments.length === 6) {
          callback(path, newVal, oldVal, operation, delta, pos);
        } else if(arguments.length === 5) {
          callback(path, newVal, oldVal, operation, delta);
        } else {
          callback(path, newVal, oldVal, operation);
        }
      });
  }
}

export { Datastore };
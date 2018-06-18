// import { retrieve, assign, pathsFor } from './fn';
//
// interface Subscriber {
//     path: string;
//     callback: Function;
//     context?;
// }
//
// interface Event {
//     path: string;
//     data;
// }
//
// class ObservableMap {
//     private data: Object = {};
//     private subscribers: Subscriber[] = [];
//
//     constructor(initialData?: Object) {
//         this.data = initialData || {};
//     }
//
//     get(path?: string) {
//         return path ? retrieve(this.data, path) : this.data;
//     }
//
//     set(path: string, data: any) {
//         assign(this.data, path, data);
//     }
//
//     subscribe(path: string, callback: Function, context?) {
//         let subscriber: Subscriber = { path, callback };
//
//         if(context) {
//             subscriber.context = context;
//         }
//
//         this.subscribers.push(subscriber);
//     }
//
//     subscribersFor(path: string) {
//         let paths = pathsFor(path);
//
//         return this.subscribers
//             .filter(sub => paths.indexOf(sub.path) > -1);
//     }
//
//     trigger(path: string, data: any) {
//         let subscribers = this.subscribersFor(path);
//
//         subscribers
//             .forEach(sub => {
//                 let event: Event = { path, data };
//                 sub.callback.call(sub.context || null, event);
//             })
//     }
// }
//
// export default ObservableMap;
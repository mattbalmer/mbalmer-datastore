export function pathsFor(path: string) {
  return path
    .split('.')
    .map((part, i, paths) => paths.slice(0, i + 1).join('.'));
}

export function exists(source: object, path: string): boolean {
  if(path.indexOf('.') < 0) {
    return source.hasOwnProperty(path);
  } else {
    let parts = path.split('.');
    let [head, tail] = [ parts[0], parts.slice(1).join('.') ];
    return exists(source[head], tail);
  }
}

export function retrieve(source: object, path: string) {
  if(path.indexOf('.') < 0) {
    return source[path]
  } else {
    let parts = path.split('.');
    return retrieve(source[parts[0]], parts.slice(1).join('.'));
  }
}

export function assign(source: object, path: string, data: any) {
  if(path.indexOf('.') < 0) {
    return source[path] = data;
  } else {
    let parts = path.split('.');
    return assign(source[parts[0]], parts.slice(1).join('.'), data);
  }
}
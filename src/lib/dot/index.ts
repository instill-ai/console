const getter = (key: string, obj: any, defaultValue?: any) => {
  const path = toPath(key);
  let index = 0;

  while (obj && index < path.length) {
    obj = obj[path[index++]];
  }

  return obj === undefined ? defaultValue : obj;
};

export default {
  getter,
};

const toPath = (key: string): string[] => {
  return key.split(".");
};

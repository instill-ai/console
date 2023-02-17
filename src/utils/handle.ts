export const handle = async <T>(
  promise: Promise<T>,
  defaultError: any = "rejected"
): Promise<readonly [undefined, T] | readonly [any, undefined]> => {
  return promise
    .then((data) => {
      const res: readonly [undefined, T] = [undefined, data];
      return res;
    })
    .catch((error) => Promise.resolve([error || defaultError, undefined]));
};

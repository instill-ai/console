export type UnionUndefinedToNull<T> = T extends undefined ? null : T;

export type UndefinedToNull<T> = {
  [Prop in keyof T]-?: T[Prop] extends object
    ? UndefinedToNull<T[Prop]>
    : UnionUndefinedToNull<T[Prop]>;
};

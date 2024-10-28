/**
 * Convert undefined to null for a given non-object value
 */
export type UnionUndefinedToNull<T> = T extends undefined ? null : T;

/**
 * Convert all undefined values to null in any given value
 */
export type UndefinedToNull<T> = {
  [Prop in keyof T]-?: T[Prop] extends object
    ? UndefinedToNull<T[Prop]>
    : UnionUndefinedToNull<T[Prop]>;
};

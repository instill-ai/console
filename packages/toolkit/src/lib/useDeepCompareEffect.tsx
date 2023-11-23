import * as React from "react";
import isEqual from "lodash.isequal";

// ref: https://github.com/react-hook-form/react-hook-form/issues/7068#issuecomment-973167261

/**
 * @param value the value to be memoized (usually a dependency list)
 * @returns a memoized version of the value as long as it remains deeply equal
 */
export function useDeepCompareMemoize<T>(value: T) {
  const ref = React.useRef<T>(value);
  const signalRef = React.useRef<number>(0);

  if (!isEqual(value, ref.current)) {
    ref.current = structuredClone(value);
    signalRef.current += 1;
  }

  return React.useMemo(() => ref.current, [signalRef.current]);
}

export function useDeepCompareEffect(
  callback: React.EffectCallback,
  dependencies: React.DependencyList
) {
  return React.useEffect(callback, useDeepCompareMemoize(dependencies));
}

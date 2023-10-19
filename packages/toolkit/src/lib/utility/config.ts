const isBrowser = () => {
  return Boolean(typeof window !== "undefined");
};

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function env(key = ""): any {
  if (!key.length) {
    throw new Error("No env key provided");
  }

  if (isBrowser() && (window as any).__env) {
    return (window as any).__env[key] === "''"
      ? ""
      : parseString((window as any).__env[key]);
  }

  return process.env[key] === "''"
    ? ""
    : parseString(process.env[key] as string);
}

const parseString = (value: string) => {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (/^\d+$/.test(value)) {
    return parseInt(value);
  }

  return value;
};

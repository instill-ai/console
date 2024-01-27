// Simplified from:
// https://github.com/andrewmclagan/react-env/blob/master/packages/node/src/index.js

function isBrowser() {
  return Boolean(typeof window !== "undefined");
}

export const env = (key = "") => {
  if (!key.length) {
    throw new Error("No env key provided");
  }

  if (isBrowser() && (window as any).__env) {
    return (window as any).__env[key] === "''"
      ? ""
      : (window as any).__env[key];
  }

  return process.env[key] === "''" ? "" : process.env[key];
};

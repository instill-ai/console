// https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781
export const stringToHash32Bit = (str: string) => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);

    hash = (hash << 5) - hash + char;
  }

  return (hash >>> 0).toString(36).padStart(7, "0");
};

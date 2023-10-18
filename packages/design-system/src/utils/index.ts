export type ElementPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const getElementPosition = (
  element: HTMLElement | Element
): ElementPosition => {
  const box = element.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const x = box.left + scrollLeft - clientLeft;
  const y = box.top + scrollTop - clientTop;

  return {
    x: x,
    y: y,
    width: box.width,
    height: box.height,
  };
};

export const getTailwindClassNumber = (className: string): number => {
  if (!hasNumber(className)) {
    throw new Error(
      "Tailwind css classNames don't have number, please try to use abitrary classname like w-[10px]"
    );
  }

  if (/\[.*\]/g.test(className)) {
    const matchString = className.match(/\[([^\][]*)]/g);

    if (!matchString || !matchString[0]) {
      throw new Error(`Wrong tailwind classname syntax - ${className}`);
    }

    const target = matchString[0].match(/\d+/g);

    if (!target || !target[0]) {
      throw new Error(`Wrong tailwind classname syntax - ${className}`);
    }

    if (className.includes("px")) {
      return parseInt(target[0]);
    }

    if (className.includes("rem")) {
      return parseInt(target[0]) * 4;
    }

    throw new Error(
      `getTailwindClassNumber now only support px and rem, input - ${className}`
    );
  }

  if (className.includes("[") || className.includes("]")) {
    throw new Error(
      `Tailwind css classname is not complete, input - ${className}`
    );
  }

  const matchIntString = className.match(/\d+/g);

  if (!matchIntString || !matchIntString[0]) {
    throw new Error(`Wrong tailwind classname syntax - ${className}`);
  }

  return parseInt(matchIntString[0]) * 4;
};

function hasNumber(s: string) {
  return /\d/.test(s);
}

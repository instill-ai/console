/**
 * Solution from
 * https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */

let canvas: HTMLCanvasElement;

export const getTextWidth = (text: string, font: string): number | null => {
  if (!canvas) canvas = document.createElement("canvas");

  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.font = font;
    const metrics = ctx.measureText(text);
    return metrics.width;
  }

  return null;
};

// Based on discussion:
// https://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document

export type ElementPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const getElementPosition = (element: HTMLElement): ElementPosition => {
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

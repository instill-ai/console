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
    console.log(metrics);
    return metrics.width;
  }

  return null;
};

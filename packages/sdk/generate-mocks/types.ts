/**
 * Credit: https://github.com/zoubingwu/msw-auto-mock
 */

export type GenerateOptions = {
  output: string;
  maxArrayLength?: number;
  includes?: string;
  excludes?: string;
  baseUrl?: string | true;
  codes?: string;
  static?: boolean;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export type SuperRefineRule = {
  key: string;
  validator: (value: any) => SuperRefineRuleValidatorReturn;
};

export type SuperRefineRuleValidatorReturn =
  | SuperRefineRuleValidatorValidReturn
  | SuperRefineRuleValidatorInvalidReturn;

export type SuperRefineRuleValidatorValidReturn = {
  valid: true;
};

export type SuperRefineRuleValidatorInvalidReturn = {
  valid: false;
  error: string;
};

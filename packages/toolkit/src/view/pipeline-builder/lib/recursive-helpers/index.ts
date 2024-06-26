import { recursiveParseNumberToString } from "./recursiveParseNumberToString";
import { recursiveParseToNum } from "./recursiveParseToNum";
import { recursiveRemoveUndefinedAndNullFromArray } from "./recursiveRemoveUndefinedAndNullFromArray";
import { recursiveReplaceNullAndEmptyStringWithUndefined } from "./recursiveReplaceNullAndEmptyStringWithUndefined";
import { recursiveReplaceTargetValue } from "./recursiveReplaceTargetValue";

export const recursiveHelpers = {
  parseToNum: recursiveParseToNum,
  removeUndefinedAndNullFromArray: recursiveRemoveUndefinedAndNullFromArray,
  replaceNullAndEmptyStringWithUndefined:
    recursiveReplaceNullAndEmptyStringWithUndefined,
  replaceTargetValue: recursiveReplaceTargetValue,
  parseNumberToString: recursiveParseNumberToString,
};

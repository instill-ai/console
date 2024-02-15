import * as React from "react";
import {
  ReferenceHintDataTypeTag,
  ReferenceHintTag,
} from "../../../../components";
import { ComponentOutoutReferenceHint } from "../../types";
import { transformInstillFormatToHumanReadableFormat } from "../../transform";

export const GroupByFormatField = ({
  hints,
  instillFormat,
  componentID,
}: {
  hints: ComponentOutoutReferenceHint[];
  instillFormat: string;
  componentID?: string;
}) => {
  const humanReadableInstillFormat = React.useMemo(() => {
    return transformInstillFormatToHumanReadableFormat(instillFormat);
  }, [instillFormat]);

  return (
    <div className="flex w-full flex-col gap-y-2">
      <div className="flex">
        <ReferenceHintDataTypeTag
          isArray={humanReadableInstillFormat.isArray}
          label={humanReadableInstillFormat.format}
        />
      </div>
      <div className="flex w-full flex-row flex-wrap gap-2">
        {hints.map((hint) => (
          <ReferenceHintTag.Root key={hint.path}>
            <ReferenceHintTag.Label
              label={
                componentID
                  ? hint.isObjectArrayChild
                    ? `${componentID}.` +
                      "output." +
                      hint.path.replace(
                        hint.objectArrayParentPath,
                        `${hint.objectArrayParentPath}[index]`
                      )
                    : `${componentID}.` + "output." + hint.path
                  : hint.path
              }
              className="!text-semantic-accent-default"
            />
          </ReferenceHintTag.Root>
        ))}
      </div>
    </div>
  );
};

import {
  ReferenceHintDataTypeTag,
  ReferenceHintTag,
} from "../../../../components";
import { ComponentOutoutReferenceHint } from "../../type";

export const GroupByFormatField = ({
  hints,
  instillFormat,
  componentID,
}: {
  hints: ComponentOutoutReferenceHint[];
  instillFormat: string;
  componentID?: string;
}) => {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <div className="flex">
        <ReferenceHintDataTypeTag label={instillFormat} />
      </div>
      <div className="flex w-full flex-row flex-wrap gap-2">
        {hints.map((hint) => (
          <ReferenceHintTag.Root key={hint.path}>
            <ReferenceHintTag.Label
              label={
                componentID
                  ? hint.isObjectArrayChild
                    ? `${componentID}.` +
                      hint.path.replace(
                        hint.objectArrayParentPath,
                        `${hint.objectArrayParentPath}[index]`
                      )
                    : `${componentID}.` + hint.path
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

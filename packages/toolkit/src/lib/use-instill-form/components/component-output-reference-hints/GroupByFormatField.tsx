import { ReferenceHintTag } from "../../../../components";
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
    <div className="flex w-full flex-col">
      <p className="mb-1 text-semantic-fg-secondary product-body-text-4-medium">
        {`[${instillFormat}]`}
      </p>
      <div className="flex w-full flex-row flex-wrap gap-2">
        {hints.map((hint) => (
          <ReferenceHintTag.Root key={hint.path}>
            <ReferenceHintTag.Label className="!text-semantic-accent-default">
              {componentID
                ? hint.isObjectArrayChild
                  ? `${componentID}.` +
                    hint.path.replace(
                      hint.objectArrayParentPath,
                      `${hint.objectArrayParentPath}[index]`
                    )
                  : `${componentID}.` + hint.path
                : hint.path}
            </ReferenceHintTag.Label>
          </ReferenceHintTag.Root>
        ))}
      </div>
    </div>
  );
};

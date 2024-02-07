import { ComponentOutputReferenceHints } from ".";
import { ComponentOutoutReferenceHint } from "../../types";

export const ObjectArrayField = ({
  hints,
  parentPath,
  componentID,
}: {
  hints: ComponentOutoutReferenceHint[];
  parentPath: string;
  componentID?: string;
}) => {
  return (
    <div className="flex flex-col gap-y-2">
      <p className="mb-1 text-semantic-fg-secondary product-body-text-4-medium">
        {`${parentPath} [array]`}
      </p>
      <div className="flex flex-col gap-y-2 rounded border border-semantic-bg-line p-2">
        <p className="text-semantic-fg-secondary product-body-text-4-regular">
          <span>{"The "}</span>
          <span className="product-body-text-4-medium">{parentPath}</span>
          <span>
            {
              " is an array with this object, you need to add the index to correctly reference its value"
            }
          </span>
        </p>
        {hints.map((hint) => {
          return (
            <ComponentOutputReferenceHints.ListField
              key={componentID + hint.path}
              componentID={componentID}
              title={hint.title}
              path={hint.path.replace(parentPath, `${parentPath}[index]`)}
              instillFormat={hint.instillFormat}
              description={hint.description}
            />
          );
        })}
      </div>
    </div>
  );
};

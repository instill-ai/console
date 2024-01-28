import { groupBy } from "../../utility";
import { ComponentOutputReferenceHints } from "../components/component-output-reference-hints";
import { ComponentOutoutReferenceHint } from "../type";

export type PickComponentsFromReferenceHintsOptions = {
  mode?: "groupByFormat" | "list";
  componentID?: string;
};

export function pickComponentsFromReferenceHints(
  hints: ComponentOutoutReferenceHint[],
  options?: PickComponentsFromReferenceHintsOptions
) {
  const mode = options?.mode ?? "list";
  const componentID = options?.componentID ?? undefined;
  const fields: React.ReactNode[] = [];

  if (mode === "list") {
    const nonObjectArrayHints: ComponentOutoutReferenceHint[] = [];
    const objectArrayHints: ComponentOutoutReferenceHint[] = [];

    hints.forEach((hint) => {
      if (hint.isObjectArrayChild) {
        objectArrayHints.push(hint);
      } else {
        nonObjectArrayHints.push(hint);
      }
    });

    const groupedObjectArrayHints = groupBy(objectArrayHints, (hint) =>
      hint.isObjectArrayChild ? hint.objectArrayParentPath : ""
    );

    nonObjectArrayHints.forEach((hint) => {
      fields.push(
        <ComponentOutputReferenceHints.ListField
          title={hint.title}
          path={hint.path}
          instillFormat={hint.instillFormat}
          description={hint.description}
          componentID={componentID}
        />
      );
    });

    Object.entries(groupedObjectArrayHints).forEach(([parentPath, hints]) => {
      fields.push(
        <ComponentOutputReferenceHints.ObjectArrayField
          parentPath={parentPath}
          hints={hints}
          componentID={componentID}
        />
      );
    });
  } else {
    const groupedHints = groupBy(hints, (hint) => hint.instillFormat);

    Object.entries(groupedHints).forEach(([instillFormat, hints]) => {
      fields.push(
        <ComponentOutputReferenceHints.GroupByFormatField
          instillFormat={instillFormat}
          hints={hints}
          componentID={componentID}
        />
      );
    });
  }

  return fields;
}

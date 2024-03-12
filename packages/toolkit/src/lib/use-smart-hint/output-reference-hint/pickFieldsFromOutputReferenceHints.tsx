import { SmartHint } from "..";
import { groupBy } from "../../utility";
import { ComponentOutputReferenceHints } from "./fields";

export function pickFieldsFromOutputReferenceHints(hints: SmartHint[]) {
  const fields: React.ReactNode[] = [];

  const nonObjectArrayHints: SmartHint[] = [];
  const objectArrayHints: SmartHint[] = [];

  hints.forEach((hint) => {
    if (hint.properties && hint.properties.length > 0) {
      objectArrayHints.push(hint);
    } else {
      nonObjectArrayHints.push(hint);
    }
  });

  const normalizeObjectArrayHints: SmartHint[] = [];

  objectArrayHints.forEach((hint) => {
    if (hint.properties) {
      hint.properties.forEach((property) => {
        normalizeObjectArrayHints.push({
          ...property,
          path: `${hint.path}[index].${property.key}`,
        });
      });
    }
  });

  const hintsGroupByFormat = groupBy(
    [...nonObjectArrayHints, ...normalizeObjectArrayHints],
    (hint) => hint.instillFormat
  );

  Object.entries(hintsGroupByFormat).forEach(([instillFormat, hints]) => {
    fields.push(
      <ComponentOutputReferenceHints.GroupByFormatField
        key={instillFormat}
        instillFormat={instillFormat}
        hints={hints}
      />
    );
  });

  return fields;
}

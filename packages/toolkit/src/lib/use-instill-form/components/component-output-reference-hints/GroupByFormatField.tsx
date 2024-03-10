import * as React from "react";
import { ReferenceHintTag } from "../../../../components";
import { ComponentOutoutReferenceHint } from "../../types";
import { transformInstillFormatToHumanReadableFormat } from "../../transform";

export const GroupByFormatField = ({
  hints,
  instillFormat,
}: {
  hints: ComponentOutoutReferenceHint[];
  instillFormat: string;
}) => {
  const humanReadableInstillFormat = React.useMemo(() => {
    return transformInstillFormatToHumanReadableFormat(instillFormat);
  }, [instillFormat]);

  return (
    <div className="flex w-full flex-col gap-y-2">
      <ReferenceHintTag.Root>
        <ReferenceHintTag.InstillFormat
          isArray={humanReadableInstillFormat.isArray}
          instillFormat={humanReadableInstillFormat.format}
        />
        {hints.map((hint, index) => (
          <ReferenceHintTag.Path
            key={hint.path}
            icon={<ReferenceHintTag.Icon type="check" />}
            path={hint.path}
            description={hint.description}
            className={index === hints.length - 1 ? "" : "!rounded-bl-none"}
          />
        ))}
      </ReferenceHintTag.Root>
    </div>
  );
};

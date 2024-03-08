import * as React from "react";
import { Nullable } from "../../../../../lib";
import { InOutputOption } from "../IteratorEditor";
import { transformInstillFormatToHumanReadableFormat } from "../../../../../lib/use-instill-form/transform";
import { ReferenceHintTag } from "../../../../../components";
import { Icons } from "@instill-ai/design-system";

export const IterateElmentHint = ({
  selectedInputOption,
}: {
  selectedInputOption: Nullable<InOutputOption>;
}) => {
  const humanReadableInstillFormat = React.useMemo(() => {
    if (!selectedInputOption || !selectedInputOption?.instill_format) {
      return null;
    }
    return transformInstillFormatToHumanReadableFormat(
      selectedInputOption.instill_format
    );
  }, [selectedInputOption]);

  return (
    <div className="flex flex-row items-center gap-x-2">
      <div className="flex flex-row items-center gap-x-1 px-2 py-px">
        <Icons.ReferenceIconCheck className="h-[9px] w-[18px] stroke-semantic-fg-disabled" />
        <p className="font-sans text-[11px] font-medium leading-[14.5px] text-semantic-fg-disabled">
          references
        </p>
      </div>

      <div className="flex flex-row gap-x-2">
        <div className="rounded bg-semantic-accent-bg px-2 py-px">
          <p className="font-sans text-[11px] font-medium leading-4 text-semantic-accent-default">
            element
          </p>
        </div>
        <p className="text-semantic-fg-secondary product-body-text-4-semibold">
          in
        </p>
      </div>

      {humanReadableInstillFormat?.format && selectedInputOption?.path ? (
        <ReferenceHintTag.Root>
          <ReferenceHintTag.InstillFormat
            isArray={humanReadableInstillFormat.isArray}
            instillFormat={humanReadableInstillFormat.format}
          />
          <ReferenceHintTag.Path
            icon={<ReferenceHintTag.Icon type="check" />}
            path={selectedInputOption.path}
            description={selectedInputOption.description}
          />
        </ReferenceHintTag.Root>
      ) : null}
    </div>
  );
};

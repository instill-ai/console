"use client";

import * as React from "react";
import { ReferenceHintTag } from "../../../../components";
import { transformInstillFormatToHumanReadableFormat } from "../../../use-instill-form/transform";

export const ListField = ({
  path,
  instillFormat,
  description,
}: {
  path: string;
  instillFormat: string;
  description?: string;
}) => {
  const humanReadableInstillFormat = React.useMemo(() => {
    return transformInstillFormatToHumanReadableFormat(instillFormat);
  }, [instillFormat]);

  return (
    <ReferenceHintTag.Root>
      <ReferenceHintTag.InstillFormat
        isArray={humanReadableInstillFormat.isArray}
        instillFormat={humanReadableInstillFormat.format}
      />
      <ReferenceHintTag.Path
        icon={<ReferenceHintTag.Icon type="check" />}
        path={`trigger.${path}`}
        description={description}
      />
    </ReferenceHintTag.Root>
  );
};

"use client";

import * as React from "react";
import { ReferenceHintTag } from "../../../../components";
import { transformInstillFormatToHumanReadableFormat } from "../../../use-instill-form/transform";
import { SmartHint } from "../..";
import { OnFieldHandle } from "../../../../view/pipeline-builder/components/OnFieldHandle";
import { Position } from "reactflow";

export const GroupByFormatField = ({
  hints,
  instillFormat,
  arrayInArray,
}: {
  hints: SmartHint[];
  instillFormat: string;
  arrayInArray?: boolean;
}) => {
  const humanReadableInstillFormat = React.useMemo(() => {
    return transformInstillFormatToHumanReadableFormat(
      instillFormat,
      arrayInArray,
    );
  }, [instillFormat, arrayInArray]);

  return (
    <div className="relative flex w-full flex-col gap-y-2">
      <ReferenceHintTag.Root>
        <ReferenceHintTag.InstillFormat
          isArray={humanReadableInstillFormat.isArray}
          instillFormat={humanReadableInstillFormat.format}
        />
        {hints.map((hint, index) => {
          const fieldPathArray = hint.path.split(".");
          fieldPathArray.shift();

          return (
            <div className="relative" key={hint.path}>
              <ReferenceHintTag.Path
                icon={<ReferenceHintTag.Icon type="check" />}
                path={hint.path}
                description={hint.description}
                className={index === hints.length - 1 ? "" : "!rounded-bl-none"}
              />
              <OnFieldHandle
                id={fieldPathArray.join(".")}
                type="source"
                position={Position.Right}
                className="absolute right-0 top-1/2 !-translate-y-1/2 !translate-x-[calc(100%+22px)]"
              />
            </div>
          );
        })}
      </ReferenceHintTag.Root>
    </div>
  );
};

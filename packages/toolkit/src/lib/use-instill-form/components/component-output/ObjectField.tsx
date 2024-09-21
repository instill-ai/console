"use client";

import * as React from "react";
import JsonView from "@uiw/react-json-view";

import { CopyToClipboardButton } from "../../../../components";
import { customTheme } from "../../../react-json-view";
import { GeneralRecord, Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { FieldRoot } from "./FieldRoot";
import { MDTextViewer } from "./MDTextViewer";
import { NoOutput } from "./NoOutput";

export type ObjectFieldProps = {
  object: Nullable<GeneralRecord>;
} & ComponentOutputFieldBaseProps;

export const ObjectField = (props: ObjectFieldProps) => {
  const { title, object, hideField } = props;

  const isJSON = React.useMemo(() => {
    if (!object) {
      return false;
    }

    return typeof object === "object" && object !== null;
  }, [object]);

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {!hideField ? (
        object ? (
          isJSON ? (
            <div className="relative flex w-full flex-col">
              <CopyToClipboardButton
                className="absolute right-2 top-2 !border-none !bg-transparent !text-semantic-fg-on-default"
                iconClassName="!stroke-semantic-bg-primary"
                text={JSON.stringify(object, null, 2)}
              />
              <JsonView
                value={object ?? {}}
                style={{
                  ...customTheme,
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  overflow: "auto",
                  maxHeight: "400px",
                }}
                enableClipboard={false}
                displayObjectSize={false}
                indentWidth={8}
                shortenTextAfterLength={0}
                displayDataTypes={false}
              />
            </div>
          ) : (
            <MDTextViewer text={String(object)} forceFormatted={true} />
          )
        ) : (
          <NoOutput />
        )
      ) : null}
    </FieldRoot>
  );
};

"use client";

import JsonView from "@uiw/react-json-view";

import { CopyToClipboardButton } from "../../../../components";
import { customTheme } from "../../../react-json-view";
import { GeneralRecord, Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { FieldRoot } from "./FieldRoot";
import { NoOutput } from "./NoOutput";

export type ObjectsFieldProps = {
  objects: Nullable<GeneralRecord[]>;
} & ComponentOutputFieldBaseProps;

export const ObjectsField = (props: ObjectsFieldProps) => {
  const { title, objects, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {!hideField ? (
        <div className="flex w-full flex-col flex-wrap gap-2">
          {objects && objects.length > 0 ? (
            objects?.map((object) => (
              <div
                key={`${title}-${JSON.stringify(object)}-field`}
                className="relative flex w-full flex-col"
              >
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
                  collapsed={3}
                />
              </div>
            ))
          ) : (
            <NoOutput />
          )}
        </div>
      ) : null}
    </FieldRoot>
  );
};

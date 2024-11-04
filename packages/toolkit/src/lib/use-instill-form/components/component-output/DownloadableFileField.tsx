"use client";

import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { FieldRoot } from "./FieldRoot";

export type DownloadableFileFieldProps = {
  file: Nullable<string>;
} & ComponentOutputFieldBaseProps;

export const DownloadableFileField = (props: DownloadableFileFieldProps) => {
  const { title, hideField, file } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {!hideField && file ? (
        <a
          className="text-semantic-accent-default hover:text-semantic-accent-hover cursor-pointer underline font-sans text-xs font-medium"
          download={`outout-${title}-download-file`}
          href={file}
        >
          Download file
        </a>
      ) : null}
    </FieldRoot>
  );
};

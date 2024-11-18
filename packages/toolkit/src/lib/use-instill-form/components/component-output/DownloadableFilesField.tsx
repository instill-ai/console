"use client";

import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { FieldRoot } from "./FieldRoot";

export type DownloadableFilesFieldProps = {
  files: Nullable<string>[];
} & ComponentOutputFieldBaseProps;

export const DownloadableFilesField = (props: DownloadableFilesFieldProps) => {
  const { title, hideField, files } = props;

  console.log("files", files);

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {!hideField ? (
        <div className="flex flex-col gap-2 flex-wrap">
          {files
            ? files.map((file, index) => {
                if (!file) return null;

                return (
                  <a
                    key={`${title}-download-file-${index}`}
                    className="text-semantic-accent-default hover:text-semantic-accent-hover cursor-pointer underline font-sans text-xs font-medium"
                    download={`outout-${title}-download-file-${index}`}
                    href={file}
                  >
                    Download file
                  </a>
                );
              })
            : null}
        </div>
      ) : null}
    </FieldRoot>
  );
};

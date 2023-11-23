import { Input } from "@instill-ai/design-system";
import * as React from "react";

export const UploadFileInput = React.forwardRef<
  HTMLInputElement,
  {
    title: string;
    fieldKey: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const { title, fieldKey, ...passThrough } = props;
  const id = `upload-file-input-${fieldKey}`;

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer rounded-full bg-semantic-accent-bg px-2 py-0.5 font-sans text-xs font-medium text-semantic-accent-default hover:bg-semantic-accent-bg-alt"
    >
      {title}
      <Input.Root className="hidden">
        <Input.Core ref={ref} {...passThrough} id={id} type="file" />
      </Input.Root>
    </label>
  );
});

UploadFileInput.displayName = "UploadFileInput";

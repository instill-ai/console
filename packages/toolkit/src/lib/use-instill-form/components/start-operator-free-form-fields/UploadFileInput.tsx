import * as React from "react";
import cn from "clsx";
import { Input } from "@instill-ai/design-system";

export const UploadFileInput = React.forwardRef<
  HTMLInputElement,
  {
    title: string;
    fieldKey: string;
    disabled?: boolean;
    keyPrefix?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const { title, fieldKey, keyPrefix, disabled, ...passThrough } = props;
  const id = `upload-file-input-${fieldKey}-${keyPrefix}`;

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex rounded-full px-2 py-0.5 font-sans text-xs font-medium text-semantic-accent-default hover:bg-semantic-accent-bg-alt",
        disabled
          ? "cursor-not-allowed bg-semantic-bg-secondary"
          : "cursor-pointer bg-semantic-accent-bg"
      )}
    >
      {title}
      <Input.Root className="hidden">
        <Input.Core
          ref={ref}
          {...passThrough}
          id={id}
          type="file"
          disabled={disabled}
        />
      </Input.Root>
    </label>
  );
});

UploadFileInput.displayName = "UploadFileInput";

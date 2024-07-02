"use client";

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
    className?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const { title, fieldKey, keyPrefix, disabled, className, ...passThrough } = props;
  const id = `upload-file-input-${fieldKey}-${keyPrefix}`;

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex rounded-full px-2 py-0.5 font-sans text-xs font-medium hover:bg-semantic-accent-bg",
        disabled
          ? "text-semantic-fg-disabled cursor-not-allowed bg-semantic-bg-secondary"
          : "text-semantic-accent-default cursor-pointer underline",
        className,
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

import cn from "clsx";

import { Icons } from "@instill-ai/design-system";
import * as React from "react";

export const FileInputDropArea = ({
  disabled,
  children,
  className,
  onDrop,
}: {
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onDrop: (fileList: FileList | null) => Promise<void>
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center gap-y-4 py-10 rounded-sm border border-semantic-bg-line",
        className,
        disabled
          ? "text-semantic-fg-disabled stroke-semantic-fg-disabled"
          : "text-semantic-fg-primary stroke-semantic-fg-secondary",
        isHovered ? "border-semantic-accent-hover outline outline-1 outline-semantic-accent-hover [&>*]:pointer-events-none" : ""
      )}
      onDragOver={(event) => event.preventDefault()}
      onDrop={async (event) => {
        event.preventDefault();

        await onDrop(event.dataTransfer.files);

        setIsHovered(false);
      }}
      onDragEnter={() => setIsHovered(true)}
      onDragLeave={() => setIsHovered(false)}
    >
      <Icons.Upload01 className="h-8 w-8 [&>path]:stroke-[1.5]" />
      <p className="text-xs">Drag-and-drop a file, or{' '}{children}</p>
    </div>
  );
};

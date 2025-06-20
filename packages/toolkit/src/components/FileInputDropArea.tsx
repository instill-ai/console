import * as React from "react";
import cn from "clsx";

import { Icons } from "@instill-ai/design-system";

export const FileInputDropArea = ({
  disabled,
  children,
  className,
  onDrop,
  text,
}: {
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onDrop: (fileList: FileList | null) => Promise<void>;
  text?: string;
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
        isHovered
          ? "border-semantic-accent-hover outline outline-1 outline-semantic-accent-hover [&>*]:pointer-events-none"
          : "",
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
      <div className="text-xs">
        {text || "Drag-and-drop a file"}
        {children}
      </div>
    </div>
  );
};

import * as React from "react";
import cn from "clsx";
import { Icons } from "@instill-ai/design-system";

function getFileExtensionFromMimeType(mimeType: string): string {
  const mimeTypeMap: { [key: string]: string } = {
    "application/pdf": "pdf",
    "image/jpeg": "jpeg",
    "image/png": "png",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "video/mp4": "mp4",
    "text/plain": "txt",
    // Add more mappings as needed
  };

  const defaultExtension = "bin"; // Default extension if no mapping found

  return mimeTypeMap[mimeType] || defaultExtension;
}

function extractMimeType(contentBase64: string): string | null {
  const mimeRegex = /^data:(.*?);base64/;
  const mimeTypeMatch = contentBase64.match(mimeRegex);
  return mimeTypeMatch ? mimeTypeMatch[1] : null;
}

function downloadBase64File(contentBase64: string): void {
  // Extracting MIME type from the contentBase64 string
  const extractedMimeType = extractMimeType(contentBase64);
  if (!extractedMimeType) {
    console.error("Failed to extract MIME type from contentBase64 string.");
    return;
  }

  // Getting file extension from MIME type
  const fileExtension = getFileExtensionFromMimeType(extractedMimeType);

  // Constructing the file name
  const fileName = `instill-ai-download.${fileExtension}`;

  // Constructing the link source
  const linkSource: string = contentBase64;

  // Creating a download link
  const downloadLink: HTMLAnchorElement = document.createElement("a");
  document.body.appendChild(downloadLink);

  // Setting download link attributes
  downloadLink.href = linkSource;
  downloadLink.target = "_self";
  downloadLink.download = fileName;

  // Triggering the download
  downloadLink.click();
}

export const DownloadButton = ({
  className,
  text,
}: {
  text: string;
  className?: string;
}) => {
  const [, setCopied] = React.useState(false);

  return (
    <button
      className={cn(
        "flex flex-row items-center gap-x-1 rounded px-1 py-0.5 hover:bg-semantic-bg-base-bg",
        className
      )}
      type="button"
      onClick={async () => {
        // await navigator.clipboard.writeText(text);
        downloadBase64File(text);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      }}
    >
      <p className="font-sans text-[10px] font-semibold text-semantic-fg-disabled">
        Download
      </p>
      <Icons.Download02 className="h-3 w-3 stroke-semantic-fg-disabled" />
    </button>
  );
};

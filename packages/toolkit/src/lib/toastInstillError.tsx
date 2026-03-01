import { Icons, toast, ToastAction } from "@instill-ai/design-system";

import { getInstillApiErrorMessage } from "./sdk-helper/getInstillApiErrorMessage";

export const TOAST_DEFAULT_DURATION = 4000;

export function toastInstillError({
  title,
  error,
  description,
  action,
  duration,
}: {
  title: string;
  error?: unknown;
  description?: string;
  action?: ToastAction;
  duration?: number;
}) {
  toast.error(title, {
    description: description ?? getInstillApiErrorMessage(error),
    duration: duration ?? TOAST_DEFAULT_DURATION,
    action: action ?? (
      <div
        onClick={() => toast.dismiss()}
        className="ml-auto flex items-center justify-end cursor-pointer"
      >
        <Icons.X className="w-5 h-5 stroke-semantic-fg-secondary" />
      </div>
    ),
    className: "!bg-semantic-error-bg",
  });
}

export type DuplicateFileInfo = {
  existing_file_name: string;
  existing_file_id: string;
  existing_namespace_id: string;
  existing_knowledge_base_id?: string;
};

/**
 * Extracts duplicate file metadata from a duplicate-content error.
 * Handles two error shapes:
 *   1. InstillError (toolkit SDK): { status: 409, response: { details: [...] } }
 *   2. Raw JSON body (EE SDK):     { code: 6, details: [...] }
 * Returns null if the error is not a duplicate file error.
 */
export function getDuplicateFileInfo(error: unknown): DuplicateFileInfo | null {
  if (!error || typeof error !== "object") return null;

  type DetailEntry = { reason?: string; metadata?: Record<string, string> };

  let details: DetailEntry[] | undefined;

  if ("status" in error) {
    // InstillError shape: { status: 409, response: { details: [...] } }
    const err = error as {
      status: number;
      response?: { details?: DetailEntry[] };
    };
    if (err.status === 409) {
      details = err.response?.details;
    }
  }

  if (!details && "code" in error) {
    // Raw gRPC-gateway JSON shape: { code: 6 (AlreadyExists), details: [...] }
    const err = error as { code: number; details?: DetailEntry[] };
    if (err.code === 6) {
      details = err.details;
    }
  }

  if (!details) return null;

  const detail = details.find((d) => d.reason === "DUPLICATE_FILE_CONTENT");
  if (!detail?.metadata) return null;
  return detail.metadata as unknown as DuplicateFileInfo;
}

/**
 * Shows a toast for duplicate file errors with a clickable link to the existing file.
 */
export function toastDuplicateFileError({
  fileName,
  existingFileName,
  existingFileLink,
  duration,
}: {
  fileName: string;
  existingFileName: string;
  existingFileLink: string;
  duration?: number;
}) {
  toast.error(`Duplicate file: "${fileName}"`, {
    description: (
      <span>
        A file with identical content already exists:{" "}
        <a
          href={existingFileLink}
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {existingFileName}
        </a>
      </span>
    ),
    duration: duration ?? TOAST_DEFAULT_DURATION,
    action: (
      <div
        onClick={() => toast.dismiss()}
        className="ml-auto flex items-center justify-end cursor-pointer"
      >
        <Icons.X className="w-5 h-5 stroke-semantic-fg-secondary" />
      </div>
    ),
    className: "!bg-semantic-error-bg",
  });
}

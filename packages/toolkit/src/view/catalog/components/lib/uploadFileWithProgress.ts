"use client";

import * as React from "react";
import { Nullable } from "instill-sdk";

type UploadProgressState = Record<string, number>;

export function useUploadWithProgress() {
  const [uploadProgress, setUploadProgress] =
    React.useState<Nullable<UploadProgressState>>(null);

  const uploadFile = React.useCallback(
    async (file: File, onProgress: (progress: number) => void) => {
      try {
        setUploadProgress((prev) => ({ ...(prev ?? {}), [file.name]: 0 }));
        const totalSize = file.size;
        let uploadedSize = 0;
        const chunkSize = 1024 * 1024; // 1MB chunks
        while (uploadedSize < totalSize) {
          await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate network delay
          uploadedSize = Math.min(uploadedSize + chunkSize, totalSize);
          const progress = (uploadedSize / totalSize) * 100;
          setUploadProgress((prev) => ({
            ...(prev ?? {}),
            [file.name]: progress,
          }));
          onProgress(progress);
        }

        return { success: true, message: "Upload completed" };
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
      } finally {
        setTimeout(() => {
          setUploadProgress((prev) => {
            if (!prev) return null;
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return Object.keys(newProgress).length > 0 ? newProgress : null;
          });
        }, 1000);
      }
    },
    [],
  );

  return { uploadFile, uploadProgress, setUploadProgress };
}

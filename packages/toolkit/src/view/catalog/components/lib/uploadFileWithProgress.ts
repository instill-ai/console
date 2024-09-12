"use client";

import * as React from "react";

type UploadProgressState = Record<string, number>;

export const useUploadWithProgress = () => {
    const [uploadProgress, setUploadProgress] = React.useState<UploadProgressState>({});

    const uploadFile = React.useCallback(async (
        file: File,
        onProgress: (progress: number) => void
    ) => {
        try {
            setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

            const totalSize = file.size;
            let uploadedSize = 0;
            const chunkSize = 1024 * 1024; // 1MB chunks

            while (uploadedSize < totalSize) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
                uploadedSize = Math.min(uploadedSize + chunkSize, totalSize);
                const progress = (uploadedSize / totalSize) * 100;
                setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
                onProgress(progress);
            }

            return { success: true, message: "Upload completed" };
        } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
        } finally {
            setTimeout(() => {
                setUploadProgress(prev => {
                    const newProgress = { ...prev };
                    delete newProgress[file.name];
                    return newProgress;
                });
            }, 1000);
        }
    }, []);

    return { uploadFile, uploadProgress, setUploadProgress };
};
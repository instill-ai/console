"use client";

import { Nullable } from "instill-sdk";
import * as React from "react";

type UploadProgressState = Record<string, number>;

export const useUploadWithProgress = () => {
    const [uploadProgress, setUploadProgress] = React.useState<UploadProgressState>({});

    const uploadFile = React.useCallback(async (
        file: File,
        ownerId: Nullable<string>,
        catalogId: string,
        accessToken: Nullable<string>,
        onProgress: (progress: number) => void
    ) => {
        try {
            setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setUploadProgress(prev => ({ ...prev, [file.name]: percentComplete }));
                    onProgress(percentComplete);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
                    onProgress(100);
                } else {
                    throw new Error(`Upload failed with status ${xhr.status}`);
                }
            };

            xhr.onerror = () => {
                throw new Error("Network error occurred during upload");
            };

            const url = `/api/v1beta/${ownerId}/catalogs/${catalogId}/files`;
            xhr.open('POST', url);
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
            xhr.send(formData);

            await new Promise((resolve, reject) => {
                xhr.onload = resolve;
                xhr.onerror = reject;
            });

            return JSON.parse(xhr.responseText);
        } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
            throw error;
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
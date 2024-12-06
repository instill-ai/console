"use client";

type ProgressCallback = (progress: number) => void;

// Helper function to make XMLHttpRequest with progress
export const makeXMLRequestWithProgress = <T>(
  url: string,
  method: string,
  accessToken: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any,
  onProgress?: ProgressCallback,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url, true);
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    xhr.setRequestHeader("Content-Type", "application/json");

    // Handle progress events
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    // Handle response
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new Error("Failed to parse response"));
        }
      } else {
        reject(new Error(`Request failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error occurred"));
    };

    xhr.send(body ? JSON.stringify(body) : undefined);
  });
};

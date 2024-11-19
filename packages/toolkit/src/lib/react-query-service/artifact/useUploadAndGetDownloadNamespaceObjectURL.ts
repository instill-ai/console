"use client";

import * as React from "react";

import { useGetNamespaceObjectDownloadURL } from "./useGetNamespaceObjectDownloadURL";
import { useGetNamespaceObjectUploadURL } from "./useGetNamespaceObjectUploadURL";
import { useUploadNamespaceObject } from "./useUploadNamespaceObject";

export function useUploadAndGetDownloadNamespaceObjectURL() {
  const getNamespaceObjectUploadURL = useGetNamespaceObjectUploadURL();
  const uploadNamespaceObject = useUploadNamespaceObject();
  const getNamespaceObjectDownloadURL = useGetNamespaceObjectDownloadURL();

  const callback = React.useCallback(
    async ({
      namespaceId,
      accessToken,
      object,
    }: {
      namespaceId: string;
      accessToken: string;

      /* eslint-disable @typescript-eslint/no-explicit-any */
      object: any;
    }) => {
      const namespaceObjectUploadURL =
        await getNamespaceObjectUploadURL.mutateAsync({
          payload: {
            namespaceId,
            objectName: object.name,
          },
          accessToken,
        });

      if (!namespaceObjectUploadURL) {
        return null;
      }

      await uploadNamespaceObject.mutateAsync({
        payload: {
          uploadUrl: namespaceObjectUploadURL.uploadUrl,
          object,
          contentType: object.type ?? "application/octet-stream",
        },
        accessToken,
      });

      const downloadURLResponse =
        await getNamespaceObjectDownloadURL.mutateAsync({
          payload: {
            namespaceId: namespaceId,
            objectUid: namespaceObjectUploadURL.object.uid,
          },
          accessToken,
        });

      return downloadURLResponse;
    },
    [],
  );

  return callback;
}

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
            parent: `namespaces/${namespaceId}`,
            displayName: object.name,
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
            name: namespaceObjectUploadURL.object.name,
          },
          accessToken,
        });

      return downloadURLResponse;
    },
    [],
  );

  return callback;
}

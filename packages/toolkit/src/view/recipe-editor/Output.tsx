"use client";

import * as React from "react";
import Image from "next/image";

import {
  InstillJSONSchema,
  InstillStore,
  Nullable,
  useComponentOutputFields,
  useInstillStore,
  useShallow,
} from "../../lib";

const selector = (store: InstillStore) => ({
  triggerPipelineStreamMap: store.triggerPipelineStreamMap,
});

export const Output = ({
  outputSchema,
}: {
  outputSchema: Nullable<InstillJSONSchema>;
}) => {
  const { triggerPipelineStreamMap } = useInstillStore(useShallow(selector));

  console.log(triggerPipelineStreamMap);

  // React.useEffect(() => {
  //   const downloadArtifact = async () => {
  //     if (
  //       !triggerPipelineStreamMap?.pipeline?.output ||
  //       !outputSchema?.properties ||
  //       !accessToken
  //     ) {
  //       return;
  //     }

  //     let output = structuredClone(triggerPipelineStreamMap?.pipeline?.output);

  //     const downloadedFromArtifactKeys: string[] = [];

  //     Object.entries(outputSchema.properties).forEach(([key, value]) => {
  //       if (
  //         value?.instillFormat === "file" ||
  //         value?.instillFormat === "array:file" ||
  //         value?.instillFormat === "image" ||
  //         value?.instillFormat === "array:image" ||
  //         value?.instillFormat === "video" ||
  //         value?.instillFormat === "array:video" ||
  //         value?.instillFormat === "audio" ||
  //         value?.instillFormat === "array:audio"
  //       ) {
  //         downloadedFromArtifactKeys.push(key);
  //       }
  //     });

  //     try {
  //       for (const key of downloadedFromArtifactKeys) {
  //         const targetValue = output[key];
  //         if (!targetValue) {
  //           continue;
  //         }

  //         if (Array.isArray(targetValue)) {
  //           const downloadedArtifacts: string[] = [];
  //           for (const item of targetValue) {
  //             if (isValidURL(item)) {
  //               const response = await downloadNamespaceObject.mutateAsync({
  //                 payload: {
  //                   downloadUrl: item,
  //                 },
  //                 accessToken,
  //               });

  //               if (!response.ok) {
  //                 continue;
  //               }

  //               const blob = await response.blob();
  //               const url = URL.createObjectURL(blob);
  //               downloadedArtifacts.push(url);
  //             }
  //           }
  //           output[key] = downloadedArtifacts;
  //         } else {
  //           if (isValidURL(targetValue)) {
  //             const response = await downloadNamespaceObject.mutateAsync({
  //               payload: {
  //                 downloadUrl: targetValue,
  //               },
  //               accessToken,
  //             });

  //             if (!response.ok) {
  //               continue;
  //             }

  //             const blob = await response.blob();
  //             const url = URL.createObjectURL(blob);
  //             output[key] = url;
  //           }
  //         }

  //         console.log("output", output);

  //         setOutputWithDownloadedArtifacts(output);
  //       }
  //     } catch (error) {
  //       setOutputWithDownloadedArtifacts(null);
  //       console.log(error);
  //     }
  //   };

  //   downloadArtifact();
  // }, [triggerPipelineStreamMap?.pipeline?.output, outputSchema, accessToken]);

  const componentOutputFields = useComponentOutputFields({
    mode: "build",
    schema: outputSchema,
    data: triggerPipelineStreamMap?.pipeline?.output ?? null,
    chooseTitleFrom: "title",
    forceFormatted: true,
  });

  const hasOutput = React.useMemo(() => {
    if (triggerPipelineStreamMap?.pipeline?.output) {
      return true;
    }
    return false;
  }, [triggerPipelineStreamMap]);

  return (
    <div className="flex flex-col py-4 w-full h-full">
      {hasOutput ? (
        <div className="flex flex-col gap-y-1 rounded bg-semantic-bg-primary">
          {componentOutputFields}
        </div>
      ) : (
        <div className="flex flex-row items-center justify-center gap-x-4 pt-24">
          <Image
            src="/images/models/no-result.svg"
            width={41}
            height={40}
            alt="Square shapes"
          />
          <p className="font-mono text-sm italic text-semantic-fg-disabled">
            Run the pipeline to view the results
          </p>
        </div>
      )}
    </div>
  );
};

"use client";

import * as React from "react";
import yaml from "js-yaml";
import SourceMap from "js-yaml-source-map";
import { NodeProps, Position, useEdges } from "reactflow";

import { cn, Icons } from "@instill-ai/design-system";

import { ImageWithFallback } from "../../../../components";
import {
  InstillStore,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useShallow,
} from "../../../../lib";
import { CustomHandle, GeneralNodeData } from "../../../pipeline-builder";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  triggerWithStreamData: store.triggerWithStreamData,
  editorRef: store.editorRef,
});

export const GeneralNode = ({ data, id }: NodeProps<GeneralNodeData>) => {
  const reactflowEdges = useEdges();
  const hasTargetEdges = React.useMemo(() => {
    return reactflowEdges.some((edge) => edge.target === id);
  }, [reactflowEdges, id]);

  const hasSourceEdges = React.useMemo(() => {
    return reactflowEdges.some((edge) => edge.source === id);
  }, [id, reactflowEdges]);

  const { accessToken, enabledQuery, triggerWithStreamData, editorRef } =
    useInstillStore(useShallow(selector));

  const routeInfo = useRouteInfo();

  const pipeline = useNamespacePipeline({
    namespacePipelineName: routeInfo.isSuccess
      ? routeInfo.data.pipelineName
      : null,
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
  });

  const isFinished = React.useMemo(() => {
    const targetTrace = triggerWithStreamData.find((data) => {
      if (!data.metadata.traces) {
        return false;
      }
      const traceKey = Object.keys(data.metadata.traces)[0];
      return traceKey === id;
    });

    if (targetTrace) {
      return true;
    } else {
      false;
    }
  }, [triggerWithStreamData, id]);

  return (
    <div
      onClick={() => {
        if (!pipeline.isSuccess || !editorRef) {
          return;
        }

        if (!pipeline.data.rawRecipe) {
          return;
        }

        const yamlSourceMap: SourceMap = new SourceMap();

        try {
          yaml.load(pipeline.data.rawRecipe, {
            listener: yamlSourceMap.listen(),
          });
        } catch (error) {
          console.log(error);
          return;
        }

        const targetPos = yamlSourceMap.lookup(`component.${id}`);

        if (targetPos) {
          editorRef.setPosition({
            lineNumber: targetPos.line - 1,
            column: targetPos.column,
          });

          setTimeout(() => {
            editorRef.focus();
          }, 1);
        }
      }}
      className={cn(
        "flex w-[60px] h-[60px] flex-col rounded p-3 bg-semantic-bg-base-bg",
        isFinished ? "bg-semantic-success-bg" : "",
      )}
      style={{
        border: "1px solid #94a0b8",
      }}
    >
      <div className="flex flex-row items-center justify-center">
        <ImageWithFallback
          src={`/icons/${data.definition?.id}.svg`}
          width={36}
          height={36}
          alt={`${data.definition?.title}-icon`}
          fallbackImg={
            <Icons.Box className="my-auto h-9 w-9 stroke-semantic-fg-primary" />
          }
        />
      </div>
      <CustomHandle
        className={hasTargetEdges ? "" : "!opacity-0"}
        type="target"
        position={Position.Left}
        id={id}
      />
      <CustomHandle
        className={hasSourceEdges ? "" : "!opacity-0"}
        type="source"
        position={Position.Right}
        id={id}
      />
    </div>
  );
};

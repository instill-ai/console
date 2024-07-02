"use client";

import * as React from "react";
import yaml from "js-yaml";
import SourceMap from "js-yaml-source-map";
import { NodeProps, Position, useEdges } from "reactflow";

import { Icons } from "@instill-ai/design-system";

import { ImageWithFallback } from "../../../../components";
import {
  InstillStore,
  useInstillStore,
  useRouteInfo,
  useShallow,
  useUserPipeline,
} from "../../../../lib";
import { CustomHandle, GeneralNodeData } from "../../../pipeline-builder";
import { useEditor } from "../../EditorContext";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const GeneralNode = ({ data, id }: NodeProps<GeneralNodeData>) => {
  const reactflowEdges = useEdges();
  const hasTargetEdges = React.useMemo(() => {
    return reactflowEdges.some((edge) => edge.target === id);
  }, [reactflowEdges, id]);

  const hasSourceEdges = React.useMemo(() => {
    return reactflowEdges.some((edge) => edge.source === id);
  }, [id, reactflowEdges]);

  const { editorRef } = useEditor();

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const routeInfo = useRouteInfo();

  const pipeline = useUserPipeline({
    pipelineName: routeInfo.isSuccess ? routeInfo.data.pipelineName : null,
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
  });

  return (
    <div
      onClick={() => {
        if (!pipeline.isSuccess) {
          return;
        }

        const view = editorRef.current?.view;

        if (!view) {
          return;
        }

        const yamlSourceMap: SourceMap = new SourceMap();

        try {
          const data = yaml.load(pipeline.data.rawRecipe, {
            listener: yamlSourceMap.listen(),
          });

          console.log(data);
        } catch (error) {
          console.log(error);
          return;
        }

        const targetPos = yamlSourceMap.lookup(`component.${id}`);

        if (targetPos) {
          // The source-map is 1-indexed
          const headPos = view.state.doc.line(targetPos.line - 1).from;

          view.dispatch({
            selection: {
              head: headPos,
              anchor: headPos,
            },
          });
        }
      }}
      className="flex w-[320px] flex-col rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-4"
    >
      <div className="flex flex-row items-center gap-x-2">
        <div className="flex rounded-sm border border-semantic-bg-line p-2">
          <ImageWithFallback
            src={`/icons/${data.definition?.id}.svg`}
            width={32}
            height={32}
            alt={`${data.definition?.title}-icon`}
            fallbackImg={
              <Icons.Box className="my-auto h-8 w-8 stroke-semantic-fg-primary" />
            }
          />
        </div>
        <p className="productbody-text-2-medium text-semantic-fg-primary">
          {id}
        </p>
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

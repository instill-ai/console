import cn from "clsx";
import * as React from "react";
import { useShallow } from "zustand/react/shallow";
import { useRouter } from "next/router";
import { Button, useToast } from "@instill-ai/design-system";

import { PipelineTemplate, PipelineTemplatesByCategory } from "../../type";
import { templates } from "../../lib/templates";
import { TemplateCard } from "./TemplateCard";
import { createGraphLayout, createInitialGraphData } from "../../lib";
import {
  InstillStore,
  Nullable,
  PipelineComponent,
  PipelineRecipe,
  generateRandomReadableName,
  useConnectorDefinitions,
  useInstillStore,
} from "../../../../lib";
import { FullTemplatesCommand } from "./FullTemplatesCommand";

const selector = (store: InstillStore) => ({
  setPipelineId: store.setPipelineId,
  setPipelineName: store.setPipelineName,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updateInitializedByTemplateOrClone: store.updateInitializedByTemplateOrClone,
  updatePipelineIsNew: store.updatePipelineIsNew,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
});

export type StaffPickTemplatesProps = {
  className?: string;
  accessToken: Nullable<string>;
  enableQuery: boolean;
};

export const StaffPickTemplates = ({
  accessToken,
  enableQuery,
  className,
}: StaffPickTemplatesProps) => {
  const [selectedCategory, setSelectedCategory] =
    React.useState<Nullable<string>>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { entity } = router.query;

  const connectorDefinitions = useConnectorDefinitions({
    connectorType: "all",
    enabled: enableQuery,
    accessToken,
  });

  const {
    setPipelineId,
    setPipelineName,
    updateNodes,
    updateEdges,
    updateInitializedByTemplateOrClone,
    updatePipelineIsNew,
    updatePipelineRecipeIsDirty,
  } = useInstillStore(useShallow(selector));

  const templatesByCategory = React.useMemo(() => {
    const result: PipelineTemplatesByCategory = {};

    if (!connectorDefinitions.isSuccess) return result;

    for (const template of templates) {
      if (!result[template.category]) {
        result[template.category] = [];
      }

      const newComponents: PipelineComponent[] = [];

      for (const component of template.recipe.components) {
        if (
          component.type === "COMPONENT_TYPE_OPERATOR" ||
          component.type === "COMPONENT_TYPE_UNSPECIFIED"
        ) {
          newComponents.push(component);
          continue;
        }

        const targetDefinition = connectorDefinitions.data.find(
          (definition) => definition.name === component.definition_name
        );

        newComponents.push({
          ...component,
          connector_definition: targetDefinition ? targetDefinition : null,
        });
      }

      const newTemplate: PipelineTemplate = {
        ...template,
        recipe: {
          ...template.recipe,
          components: newComponents,
        },
      };

      result[template.category].push(newTemplate);
    }

    console.log(result);

    return result;
  }, [connectorDefinitions.data, connectorDefinitions.isSuccess]);

  function onSelectTemplate(template: PipelineTemplate) {
    if (!connectorDefinitions.isSuccess) return;

    const newComponents: PipelineComponent[] = [];

    for (const component of template.recipe.components) {
      if (
        component.type === "COMPONENT_TYPE_OPERATOR" ||
        component.type === "COMPONENT_TYPE_UNSPECIFIED"
      ) {
        newComponents.push(component);
        continue;
      }

      const targetDefinition = connectorDefinitions.data.find(
        (definition) => definition.name === component.definition_name
      );

      if (!targetDefinition) {
        toast({
          title: "Something went wrong when initialize pipeline by template",
          description: "Please contact Instill AI support",
          variant: "alert-error",
          size: "large",
        });
        break;
      }

      newComponents.push({
        ...component,
        connector_definition: targetDefinition,
      });
    }

    const recipeWithCompleteConnectorDefinition: PipelineRecipe = {
      ...template.recipe,
      components: newComponents,
    };

    const initialGraphData = createInitialGraphData(
      recipeWithCompleteConnectorDefinition
    );

    const randomName = generateRandomReadableName();

    createGraphLayout(initialGraphData.nodes, initialGraphData.edges).then(
      (graphData) => {
        updateNodes(() => graphData.nodes);
        updateEdges(() => graphData.edges);
        setPipelineId(randomName);
        setPipelineName(`users/${entity}/pipelines/${randomName}`);
        updatePipelineRecipeIsDirty(() => true);
        updateInitializedByTemplateOrClone(() => true);
        updatePipelineIsNew(() => true);
        router.push(`/${entity}/pipelines/${randomName}`);
      }
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col rounded bg-semantic-bg-secondary",
        className
      )}
    >
      <div className="flex flex-row border-b border-semantic-bg-line px-4 py-2">
        <svg
          width="112"
          height="11"
          viewBox="0 0 112 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="my-auto mr-20"
        >
          <g clipPath="url(#clip0_195_13750)">
            <path
              d="M10.9941 0.133179H0.00878906V2.33025H4.40292V11.1185H6.59998V2.33025H10.9941V0.133179Z"
              fill="#1D2433"
            />
          </g>
          <g clipPath="url(#clip1_195_13750)">
            <path
              d="M15.8728 0.133179V2.33025H22.464V0.133179H15.8728ZM13.6758 11.1185H22.464V8.92145H15.8728V6.72438H22.464V4.52731H15.8728V2.33025H13.6758V11.1185Z"
              fill="#1D2433"
            />
          </g>
          <g clipPath="url(#clip2_195_13750)">
            <path
              d="M27.3489 0.133179H25.1519V11.1185H27.3489V4.5587H29.546V2.36163H27.3489V0.133179ZM33.9401 2.36163H31.743V4.5587H33.9401V11.1185H36.1372V0.133179H33.9401V2.36163ZM31.743 6.75577V4.5587H29.546V6.75577H31.743Z"
              fill="#1D2433"
            />
          </g>
          <g clipPath="url(#clip3_195_13750)">
            <path
              d="M46.5114 2.31455V0.133179H37.7231V11.1185H39.9202V8.92145H46.5114V6.72438H39.9202V2.31455H46.5114ZM46.5114 6.72438H48.7085V2.31455H46.5114V6.72438Z"
              fill="#1D2433"
            />
          </g>
          <g clipPath="url(#clip4_195_13750)">
            <path
              d="M53.6029 0.133179H51.3901V11.1185H60.1784V8.90575H53.6029V0.133179Z"
              fill="#1D2433"
            />
          </g>
          <g clipPath="url(#clip5_195_13750)">
            <path
              d="M69.4569 0.133179V2.33025H71.654V6.72438H67.2598V4.52731H65.0628V8.92145H71.654V11.1185H73.851V0.133179H69.4569ZM67.2598 2.33025V4.52731H69.4569V2.33025H67.2598ZM65.0628 11.1185V8.92145H62.8657V11.1185H65.0628Z"
              fill="#1D2433"
            />
          </g>
          <g clipPath="url(#clip6_195_13750)">
            <path
              d="M86.4223 0.133179H75.437V2.33025H79.8311V11.1185H82.0282V2.33025H86.4223V0.133179Z"
              fill="#1D2433"
            />
          </g>
          <g clipPath="url(#clip7_195_13750)">
            <path
              d="M91.3016 0.133179V2.33025H97.8927V0.133179H91.3016ZM89.1045 11.1185H97.8927V8.92145H91.3016V6.72438H97.8927V4.52731H91.3016V2.33025H89.1045V11.1185Z"
              fill="#1D2433"
            />
          </g>
          <g clipPath="url(#clip8_195_13750)">
            <path
              d="M102.777 4.52731V2.33025H109.368V0.133179H100.58V6.72438H109.368V8.92145H111.565V4.52731H102.777ZM109.368 11.1185V8.92145H100.58V11.1185H109.368Z"
              fill="#1D2433"
            />
          </g>
          <defs>
            <clipPath id="clip0_195_13750">
              <rect width="11" height="11" fill="white" />
            </clipPath>
            <clipPath id="clip1_195_13750">
              <rect
                width="11"
                height="11"
                fill="white"
                transform="translate(12.5713)"
              />
            </clipPath>
            <clipPath id="clip2_195_13750">
              <rect
                width="11"
                height="11"
                fill="white"
                transform="translate(25.1431)"
              />
            </clipPath>
            <clipPath id="clip3_195_13750">
              <rect
                width="11"
                height="11"
                fill="white"
                transform="translate(37.7144)"
              />
            </clipPath>
            <clipPath id="clip4_195_13750">
              <rect
                width="11"
                height="11"
                fill="white"
                transform="translate(50.2856)"
              />
            </clipPath>
            <clipPath id="clip5_195_13750">
              <rect
                width="11"
                height="11"
                fill="white"
                transform="translate(62.8569)"
              />
            </clipPath>
            <clipPath id="clip6_195_13750">
              <rect
                width="11"
                height="11"
                fill="white"
                transform="translate(75.4282)"
              />
            </clipPath>
            <clipPath id="clip7_195_13750">
              <rect
                width="11"
                height="11"
                fill="white"
                transform="translate(88)"
              />
            </clipPath>
            <clipPath id="clip8_195_13750">
              <rect
                width="11"
                height="11"
                fill="white"
                transform="translate(100.571)"
              />
            </clipPath>
          </defs>
        </svg>
        <div className="flex flex-row gap-x-2">
          {Object.keys(templatesByCategory).map((category) => (
            <Button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
              }}
              variant="tertiaryGrey"
              size="md"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-row gap-x-6 px-24 py-3">
        {connectorDefinitions.isSuccess
          ? selectedCategory
            ? templatesByCategory[selectedCategory]
                .slice(0, 3)
                .map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => {
                      onSelectTemplate(template);
                    }}
                    className="w-[215px]"
                  />
                ))
            : templatesByCategory[Object.keys(templatesByCategory)[0]]
                .slice(0, 3)
                .map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => {
                      onSelectTemplate(template);
                    }}
                    className="w-[215px]"
                  />
                ))
          : [0, 1, 2].map((e) => (
              <div
                key={`template-skeleton-${e}`}
                className="block h-[130px] w-[215px] animate-pulse rounded-[4px] bg-semantic-bg-line"
              />
            ))}

        <FullTemplatesCommand
          templatesByCategory={templatesByCategory}
          onSelectTemplate={onSelectTemplate}
        />
      </div>
    </div>
  );
};

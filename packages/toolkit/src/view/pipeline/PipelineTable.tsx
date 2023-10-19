import cn from "clsx";
import * as React from "react";
import {
  ConnectionTypeCell,
  TableHead,
  ModelsCell,
  TableError,
  SkeletonCell,
  TextCell,
  type TableHeadItem,
} from "../../components";
import { Pipeline, getComponentsFromPipelineRecipe } from "../../lib";

export type PipelineTableProps = {
  pipeline: Pipeline;
  isError: boolean;
  isLoading: boolean;

  /**
   * Default is undefined
   */
  marginBottom?: string;
};

export const PipelineTable = (props: PipelineTableProps) => {
  const { pipeline, marginBottom, isError, isLoading } = props;
  const tableHeadItems = React.useMemo<TableHeadItem[]>(() => {
    const getHeadItem = (name: string) => {
      return (
        <div className="flex flex-row gap-x-[15px]">
          <div className="my-auto text-instillGrey90 text-instill-body">
            {name}
          </div>
        </div>
      );
    };

    return [
      {
        key: "pipeline-source",
        item: getHeadItem("Source"),
        width: "w-auto",
      },
      {
        key: "pipeline-models",
        item: getHeadItem("Models"),
        width: "w-auto",
      },
      {
        key: "pipeline-destination",
        item: getHeadItem("Destination"),
        width: "w-auto",
      },
    ];
  }, []);

  if (isError) {
    return <TableError />;
  }

  const sourceComponent = getComponentsFromPipelineRecipe({
    recipe: pipeline.recipe,
    connectorResourceType: "CONNECTOR_TYPE_OPERATOR",
  });

  const destinationComponent = getComponentsFromPipelineRecipe({
    recipe: pipeline.recipe,
    connectorResourceType: "CONNECTOR_TYPE_DATA",
  });

  const aiComponent = getComponentsFromPipelineRecipe({
    recipe: pipeline.recipe,
    connectorResourceType: "CONNECTOR_TYPE_AI",
  });

  return (
    <table className={cn("w-full table-auto border-collapse", marginBottom)}>
      <TableHead
        bgColor="bg-instillGrey05"
        borderColor="border-instillGrey20"
        items={tableHeadItems}
      />
      <tbody>
        <tr className="bg-white border border-instillGrey20">
          {isLoading ? (
            <>
              <SkeletonCell width={null} padding="py-2 pl-6" />
              <SkeletonCell width={null} padding="py-2" />
              <SkeletonCell width={null} padding="py-2 pr-6" />
            </>
          ) : (
            <>
              {sourceComponent[0] && sourceComponent[0].resource ? (
                <ConnectionTypeCell
                  width={null}
                  connectorDefinition={
                    sourceComponent[0].resource.connector_definition
                  }
                  connectorName={sourceComponent[0].resource_name}
                  padding="py-2 pl-6"
                />
              ) : (
                <TextCell text="Not set" width={null} padding="py-2" />
              )}
              <ModelsCell models={aiComponent} width={null} padding="py-2" />
              {destinationComponent[0] && destinationComponent[0].resource ? (
                <ConnectionTypeCell
                  width={null}
                  connectorDefinition={
                    destinationComponent[0].resource.connector_definition
                  }
                  connectorName={destinationComponent[0].resource_name}
                  padding="py-2 pr-6"
                />
              ) : (
                <TextCell text="Not set" width={null} padding="py-2" />
              )}
            </>
          )}
        </tr>
      </tbody>
    </table>
  );
};

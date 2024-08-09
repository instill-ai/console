import * as React from "react";
import type { Pipeline } from "instill-sdk";

import { ColumnDef, DataTable } from "@instill-ai/design-system";

import {
  /* EmptyView,
  LoadingSpin, */
  PipelineRunStateLabel,
} from "../../../../components";
import {
  convertToSecondsAndMilliseconds,
  formatDate,
  /* InstillStore,
  PipelineTriggerRecord,
  useInstillStore,
  usePipelineTriggers,
  useRouteInfo,
  useShallow, */
} from "../../../../lib";
//import { TABLE_PAGE_SIZE } from "../constants";
import Link from "next/link";
//import { useParams } from "next/navigation";

/* const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
}); */

export type PipelineRunListProps = {
  pipeline?: Pipeline;
};

export const PipelineRunList = ({ pipeline }: PipelineRunListProps) => {
  //const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  //const routeInfo = useRouteInfo();
  //const { path } = useParams();
  /* const triggers = usePipelineTriggers({
    enabled: enabledQuery && !!pipeline && routeInfo.isSuccess,
    filter: `pipelineId='${pipeline?.id}' AND ownerName='${routeInfo.data.namespaceName}'`,
    accessToken,
    filterId: `${pipeline?.id}-${routeInfo.data.namespaceName}`,
  }); */

  const ownerId = React.useMemo(() => {
    return pipeline?.name.split("/")[1];
  }, [pipeline]);

  //const columns: ColumnDef<PipelineTriggerRecord>[] = [
  const columns: ColumnDef<unknown>[] = [
    {
      accessorKey: "pipelineTriggerId",
      header: () => <div className="text-left">Run ID</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-secondary break-all">
            <Link href={`/${ownerId}/pipelines/${pipeline?.id}/runs/${row.getValue("pipelineTriggerId")}`} className="text-semantic-accent-default hover:underline">{row.getValue("pipelineTriggerId")}</Link>
          </div>
        );
      },
    },
    {
      accessorKey: "version",
      header: () => <div className="text-left">Version</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-secondary break-all">
            <Link href={`/${ownerId}/pipelines/${pipeline?.id}/playground?version=${row.getValue("version")}`} className="text-semantic-accent-default hover:underline">{row.getValue("version")}</Link>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-left">State</div>,
      cell: ({ row }) => {
        return (
          <PipelineRunStateLabel
            state={row.getValue("status")}
            className="inline-flex"
          />
        );
      },
    },
    {
      accessorKey: "source",
      header: () => <div className="text-left">Source</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-secondary break-all">
            {row.getValue("source")}
          </div>
        );
      },
    },
    {
      accessorKey: "computeTimeDuration",
      header: () => <div className="text-left">Trigger Time</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-alt-primary">
            {convertToSecondsAndMilliseconds(
              row.getValue("computeTimeDuration"),
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "triggerTime",
      header: () => <div className="text-left">Timestamp</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-alt-primary">
            {formatDate(row.getValue("triggerTime"))}
          </div>
        );
      },
    },
    {
      accessorKey: "runner",
      header: () => <div className="text-left">Runner</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-secondary break-all">
            {row.getValue("runner")}
          </div>
        );
      },
    },
    {
      accessorKey: "creditSpent",
      header: () => <div className="text-left">Credit</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-secondary break-all">
            {row.getValue("creditSpent")}
          </div>
        );
      },
    },
  ];

  /* if (triggers.isPending) {
    return <LoadingSpin className="!m-0 !text-semantic-fg-secondary" />;
  }

  if (triggers.isSuccess && triggers.data.length === 0) {
    return (
      <EmptyView
        iconName="Zap"
        title="No runs yet"
        description="This pipeline hasn't been run yet."
        className="flex-1"
      />
    );
  } */
//
  return (
    <div className="[&_table]:table-fixed [&_table_td]:align-top [&_table_th]:w-40 [&_table_th:nth-child(1)]:w-auto [&_table_th:nth-child(7)]:w-52 [&_table_th:nth-child(8)]:w-28">
      <DataTable
        columns={columns}
        //data={triggers.data ?? []}
        data={[
          {
            triggerTime: 'Fri Aug 02 2024 12:12:00 GMT+0200 (Central European Summer Time)',
            pipelineTriggerId: 'asasdasdasd211312',
            pipelineId: '123123',
            pipelineUid: '12312312323assa',
            pipelineMode: 'MODE_ASYNC',
            computeTimeDuration: 1.23123,
            status: 'STATUS_COMPLETED',
            version: 'v1.0.0',
            source: 'Web click',
            runner: 'a-choo',
            creditSpent: 23.56,
          },
          {
            triggerTime: 'Fri Aug 02 2024 12:14:00 GMT+0200 (Central European Summer Time)',
            pipelineTriggerId: 'asasdasdasd2113asdasdasd12',
            pipelineId: '1231asdsa23',
            pipelineUid: '12312312asdas323assa',
            pipelineMode: 'MODE_SYNC',
            computeTimeDuration: 2.123,
            status: 'STATUS_ERRORED',
            version: 'v1.1.0',
            source: 'Web click',
            runner: 'a-choo',
            creditSpent: 21.2,
          },
          {
            triggerTime: 'Fri Aug 02 2024 12:16:00 GMT+0200 (Central European Summer Time)',
            pipelineTriggerId: 'asasdasdasdsasdasd211312',
            pipelineId: '1231asdasd23',
            pipelineUid: '1231231232asd3assa',
            pipelineMode: 'MODE_ASYNC',
            computeTimeDuration: 1.1,
            status: 'STATUS_COMPLETED',
            version: 'v1.2.5',
            source: 'Web click',
            runner: 'a-choasdasdasdasdasdsadsadasdasasdsadasdsddsaaso',
            creditSpent: 17.123,
          }
        ]}
        //pageSize={TABLE_PAGE_SIZE}
        pageSize={2}
        isLoading={false/* !triggers.isSuccess */}
        //loadingRows={TABLE_PAGE_SIZE}
        loadingRows={2}
      />
    </div>
  );
};

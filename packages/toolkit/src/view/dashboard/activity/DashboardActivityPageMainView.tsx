"use client";

import * as React from "react";
import {
  ModelTriggerChartRecord,
  PipelinesChart,
  TriggeredModel,
  TriggeredPipeline,
} from "instill-sdk";

import { SelectOption } from "@instill-ai/design-system";

import {
  DashboardAvailableTimeframe,
  getModelTriggersSummary,
  getPipelineTriggersSummary,
  getPreviousTimeframe,
  getTimeInRFC3339Format,
  InstillStore,
  Nullable,
  useInstillStore,
  useModelTriggerComputationTimeCharts,
  useModelTriggerMetric,
  usePipelineTriggerComputationTimeCharts,
  usePipelineTriggerMetric,
  useRouteInfo,
  useShallow,
} from "../../../lib";
import { UsageSwitch } from "../UsageSwitch";
import { ActivityTab } from "./ActivityTab";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  selectedNamespace: store.navigationNamespaceAnchor,
});

export const DashboardActivityPageMainView = () => {
  const [selectedTimeOption, setSelectedTimeOption] =
    React.useState<SelectOption>({
      label: "Today",
      value: "24h",
    });

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector),
  );

  const [queryString, setQueryString] = React.useState<Nullable<string>>(null);
  const [queryStringPrevious, setQueryStringPrevious] =
    React.useState<Nullable<string>>(null);
  const [activeTab, setActiveTab] = React.useState<"activity" | "cost">(
    "activity",
  );

  const routeInfo = useRouteInfo();

  React.useEffect(() => {
    if (!routeInfo.isSuccess) {
      return;
    }

    let queryParams = `ownerName='${routeInfo.data.namespaceName}'`;
    let queryParamsPrevious = `ownerName='${routeInfo.data.namespaceName}'`;

    if (selectedTimeOption) {
      const start = getTimeInRFC3339Format(
        selectedTimeOption.value === "24h"
          ? "todayStart"
          : selectedTimeOption.value,
      );
      const stop = getTimeInRFC3339Format(
        selectedTimeOption?.value === "1d" ? "todayStart" : "now",
      );
      const previousTime = getTimeInRFC3339Format(
        getPreviousTimeframe(
          selectedTimeOption.value as DashboardAvailableTimeframe,
        ),
      );

      queryParams += ` AND start='${start}' AND stop='${stop}'`;
      queryParamsPrevious += ` AND start='${previousTime}' AND stop='${start}'`;
    }

    setQueryString(queryParams);
    setQueryStringPrevious(queryParamsPrevious);
  }, [
    selectedTimeOption,
    routeInfo.isSuccess,
    routeInfo.data?.namespaceName,
    selectedNamespace,
  ]);

  const triggeredPipelines = usePipelineTriggerMetric({
    enabled: enabledQuery && !!queryString,
    filter: queryString ? queryString : null,
    accessToken,
    requesterId: selectedNamespace ?? undefined,
  });

  const pipelinesChart = usePipelineTriggerComputationTimeCharts({
    enabled: enabledQuery && !!queryString,
    filter: queryString ? queryString : null,
    accessToken,
    requesterId: selectedNamespace ?? undefined,
  });

  const modelsChart = useModelTriggerComputationTimeCharts({
    enabled: enabledQuery && !!queryString,
    accessToken,
    requesterId: selectedNamespace ?? undefined,
    filter: queryString ? queryString : null,
  });

  const triggeredModels = useModelTriggerMetric({
    enabled: enabledQuery && !!queryString,
    accessToken,
    requesterId: selectedNamespace ?? undefined,
    filter: queryString ? queryString : null,
  });

  const previousTriggeredPipelines = usePipelineTriggerMetric({
    enabled: enabledQuery && !!queryStringPrevious,
    filter: queryStringPrevious ? queryStringPrevious : null,
    accessToken,
    requesterId: selectedNamespace ?? undefined,
  });

  const previousTriggeredModels = useModelTriggerMetric({
    enabled: enabledQuery && !!queryStringPrevious,
    accessToken,
    requesterId: selectedNamespace ?? undefined,
    filter: queryStringPrevious ? queryStringPrevious : null,
  });

  // React.useEffect(() => {
  //   if (
  //     triggeredPipelines.isError ||
  //     pipelinesChart.isError ||
  //     previousTriggeredPipelines.isError ||
  //     triggeredModels.isError ||
  //     modelsChart.isError ||
  //     previousTriggeredModels.isError
  //   ) {
  //     router.push("/404");
  //   }
  // }, [
  //   router,
  //   triggeredPipelines.isError,
  //   pipelinesChart.isError,
  //   previousTriggeredPipelines.isError,
  //   triggeredModels.isError,
  //   modelsChart.isError,
  //   previousTriggeredModels.isError,
  // ]);

  const pipelinesChartList = React.useMemo<PipelinesChart[]>(() => {
    if (!pipelinesChart.isSuccess) {
      return [];
    }

    return pipelinesChart.data.map((pipeline) => ({
      ...pipeline,
    }));
  }, [pipelinesChart.data, pipelinesChart.isSuccess]);

  const modelChartList = React.useMemo<ModelTriggerChartRecord[]>(() => {
    if (!modelsChart.isSuccess) {
      return [];
    }

    return modelsChart.data.map((model) => ({
      ...model,
    }));
  }, [modelsChart.data, modelsChart.isSuccess]);

  const triggeredPipelineList = React.useMemo<TriggeredPipeline[]>(() => {
    if (!triggeredPipelines.isSuccess) return [];
    return triggeredPipelines.data;
  }, [triggeredPipelines.data, triggeredPipelines.isSuccess]);

  const triggeredModelList = React.useMemo<TriggeredModel[]>(() => {
    if (!triggeredModels.isSuccess) return [];
    return triggeredModels.data;
  }, [triggeredModels.data, triggeredModels.isSuccess]);

  const pipelineTriggersSummary = React.useMemo(() => {
    if (!previousTriggeredPipelines.isSuccess) return null;

    const triggeredPipelineIdList = triggeredPipelineList.map(
      (e) => e.pipelineId,
    );

    return getPipelineTriggersSummary(
      triggeredPipelineList,
      previousTriggeredPipelines.data.filter((trigger) =>
        triggeredPipelineIdList.includes(trigger.pipelineId),
      ),
    );
  }, [
    previousTriggeredPipelines.isSuccess,
    previousTriggeredPipelines.data,
    triggeredPipelineList,
  ]);

  const modelTriggersSummary = React.useMemo(() => {
    if (!previousTriggeredModels.isSuccess) return null;

    const triggeredModelIdList = triggeredModelList.map((e) => e.modelId);

    return getModelTriggersSummary(
      triggeredModelList,
      previousTriggeredModels.data.filter((trigger) =>
        triggeredModelIdList.includes(trigger.modelId),
      ),
    );
  }, [
    previousTriggeredModels.isSuccess,
    previousTriggeredModels.data,
    triggeredModelList,
  ]);

  return (
    <div className="flex flex-col">
      <h1 className="product-headings-heading-4 mb-2">Usage</h1>
      <UsageSwitch
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        namespaceId={routeInfo.data.namespaceId}
      />
      <ActivityTab
        pipelinesChart={pipelinesChart}
        modelsChart={modelsChart}
        pipelinesChartList={pipelinesChartList}
        modelsChartList={modelChartList}
        selectedTimeOption={selectedTimeOption}
        setSelectedTimeOption={setSelectedTimeOption}
        pipelineTriggersSummary={pipelineTriggersSummary}
        modelTriggersSummary={modelTriggersSummary}
      />
    </div>
  );
};

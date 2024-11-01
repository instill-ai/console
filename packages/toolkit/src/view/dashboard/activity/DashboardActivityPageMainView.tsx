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
  useUserNamespaces,
} from "../../../lib";
import { UsageSwitch } from "../UsageSwitch";
import { ActivityTab } from "./ActivityTab";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  selectedNamespace: store.navigationNamespaceAnchor,
});

export const DashboardActivityPageMainView = () => {
  const [selectedTimeOption, setSelectedTimeOption] = React.useState<SelectOption>({
    label: "Today",
    value: "24h",
  });

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector),
  );

  const [activeTab, setActiveTab] = React.useState<"activity" | "cost">("activity");

  const routeInfo = useRouteInfo();
  const userNamespaces = useUserNamespaces();

  const targetNamespace = React.useMemo(() => {
    if (!userNamespaces.isSuccess || !selectedNamespace) {
      return null;
    }

    return userNamespaces.data.find(
      (namespace) => namespace.id === selectedNamespace,
    );
  }, [
    userNamespaces.isSuccess,
    userNamespaces.data,
    selectedNamespace,
  ]);

  // Compute queryString using useMemo and targetNamespace
  const queryString = React.useMemo<Nullable<string>>(() => {
    if (!targetNamespace) return null;

    let q = `ownerName='${targetNamespace.name}'`;

    if (selectedTimeOption) {
      const start = getTimeInRFC3339Format(
        selectedTimeOption.value === "24h" ? "todayStart" : selectedTimeOption.value,
      );
      const stop = getTimeInRFC3339Format(
        selectedTimeOption.value === "1d" ? "todayStart" : "now",
      );

      q += ` AND start='${start}' AND stop='${stop}'`;
    }

    return q;
  }, [
    selectedTimeOption,
    targetNamespace,
  ]);

  const queryStringPrevious = React.useMemo<Nullable<string>>(() => {
    if (!targetNamespace) return null;

    let qPrev = `ownerName='${targetNamespace.name}'`;

    if (selectedTimeOption) {
      const previousTime = getTimeInRFC3339Format(
        getPreviousTimeframe(selectedTimeOption.value as DashboardAvailableTimeframe),
      );
      const start = getTimeInRFC3339Format(
        selectedTimeOption.value === "1d" ? "todayStart" : selectedTimeOption.value,
      );

      qPrev += ` AND start='${previousTime}' AND stop='${start}'`;
    }

    return qPrev;
  }, [
    selectedTimeOption,
    targetNamespace,
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

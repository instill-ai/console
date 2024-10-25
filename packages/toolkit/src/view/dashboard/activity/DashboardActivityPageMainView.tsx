"use client"

import * as React from "react"
import { SelectOption } from "@instill-ai/design-system"
import {
  GeneralAppPageProp,
  useRouteInfo,
} from "../../../lib"
import { UsageSwitch } from "../UsageSwitch"
import { ActivityTab } from "./ActivityTab"

export type DashboardActivityPageMainViewProps = GeneralAppPageProp

export const DashboardActivityPageMainView = ({
  accessToken,
  enableQuery,
}: DashboardActivityPageMainViewProps) => {
  const [selectedTimeOption, setSelectedTimeOption] = React.useState<SelectOption>({
    label: "Today",
    value: "24h",
  })

  const [activeTab, setActiveTab] = React.useState<"activity" | "cost">("activity")
  const routeInfo = useRouteInfo()

  React.useEffect(() => {
    // Reset state when namespace changes
    setSelectedTimeOption({
      label: "Today",
      value: "24h",
    })
  }, [routeInfo.data?.namespaceId])

  if (!routeInfo.isSuccess) return null


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
  return (
    <div className="flex flex-col">
      <h1 className="product-headings-heading-4 mb-2">Usage</h1>
      <UsageSwitch
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        namespaceId={routeInfo.data.namespaceId}
        key={`usage-switch-${routeInfo.data.namespaceId}`}
      />
      <ActivityTab
        selectedTimeOption={selectedTimeOption}
        setSelectedTimeOption={setSelectedTimeOption}
        namespaceId={routeInfo.data.namespaceId}
        accessToken={accessToken}
        enabledQuery={enableQuery}
        key={`activity-tab-${routeInfo.data.namespaceId}-${selectedTimeOption.value}`}
      />
    </div>
  )
}
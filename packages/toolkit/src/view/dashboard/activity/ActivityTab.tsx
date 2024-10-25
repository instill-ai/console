"use client"

import * as React from "react"
import { SelectOption } from "@instill-ai/design-system"
import { FilterByDay } from "../FilterByDay"
import { PipelineTriggerCountsLineChart } from "./PipelineTriggerCountsLineChart"
import { ModelsTriggerCountsLineChart } from "./ModelsTriggerCountsLineChart"
import {
    ModelsChart,
    PipelinesChart,
    usePipelineTriggerComputationTimeCharts,
    usePipelineTriggerMetric,
    useModelTriggerComputationTimeCharts,
    useModelTriggerMetric,
    getTimeInRFC3339Format,
    getPreviousTimeframe,
    DashboardAvailableTimeframe,
    getPipelineTriggersSummary,
    getModelTriggersSummary,
} from "../../../lib"
import { Nullable } from "instill-sdk"

type ActivityTabProps = {
    selectedTimeOption: SelectOption
    setSelectedTimeOption: React.Dispatch<React.SetStateAction<SelectOption>>
    namespaceId: Nullable<string>
    accessToken: Nullable<string>
    enabledQuery: boolean
}

export const ActivityTab = ({
    selectedTimeOption,
    setSelectedTimeOption,
    namespaceId,
    accessToken,
    enabledQuery,
}: ActivityTabProps) => {
    const [queryString, setQueryString] = React.useState<Nullable<string>>(null)
    const [queryStringPrevious, setQueryStringPrevious] = React.useState<Nullable<string>>(null)

    React.useEffect(() => {
        if (!namespaceId) return

        let queryParams = `ownerName='${namespaceId}'`
        let queryParamsPrevious = `ownerName='${namespaceId}'`

        const start = getTimeInRFC3339Format(
            selectedTimeOption.value === "24h" ? "todayStart" : selectedTimeOption.value
        )
        const stop = getTimeInRFC3339Format("now")
        const previousTime = getTimeInRFC3339Format(
            getPreviousTimeframe(selectedTimeOption.value as DashboardAvailableTimeframe)
        )

        queryParams += ` AND start='${start}' AND stop='${stop}'`
        queryParamsPrevious += ` AND start='${previousTime}' AND stop='${start}'`

        setQueryString(queryParams)
        setQueryStringPrevious(queryParamsPrevious)
    }, [selectedTimeOption, namespaceId])

    const triggeredPipelines = usePipelineTriggerMetric({
        enabled: enabledQuery && Boolean(queryString),
        filter: queryString,
        accessToken,
    })

    const pipelinesChart = usePipelineTriggerComputationTimeCharts({
        enabled: enabledQuery && Boolean(queryString),
        filter: queryString,
        accessToken,
    })

    const modelsChart = useModelTriggerComputationTimeCharts({
        enabled: enabledQuery && Boolean(queryString),
        filter: queryString,
        accessToken,
    })

    const triggeredModels = useModelTriggerMetric({
        enabled: enabledQuery && Boolean(queryString),
        filter: queryString,
        accessToken,
    })

    const previousTriggeredPipelines = usePipelineTriggerMetric({
        enabled: enabledQuery && Boolean(queryStringPrevious),
        filter: queryStringPrevious,
        accessToken,
    })

    const previousTriggeredModels = useModelTriggerMetric({
        enabled: enabledQuery && Boolean(queryStringPrevious),
        filter: queryStringPrevious,
        accessToken,
    })

    const pipelinesChartList = React.useMemo<PipelinesChart[]>(() => {
        if (!pipelinesChart.isSuccess) return []
        return pipelinesChart.data.map((pipeline) => ({
            ...pipeline,
        }))
    }, [pipelinesChart.data, pipelinesChart.isSuccess])

    const modelChartList = React.useMemo<ModelsChart[]>(() => {
        if (!modelsChart.isSuccess) return []
        return modelsChart.data.map((model) => ({
            ...model,
        }))
    }, [modelsChart.data, modelsChart.isSuccess])

    const triggeredPipelineList = React.useMemo(() => {
        if (!triggeredPipelines.isSuccess) return []
        return triggeredPipelines.data
    }, [triggeredPipelines.data, triggeredPipelines.isSuccess])

    const triggeredModelList = React.useMemo(() => {
        if (!triggeredModels.isSuccess) return []
        return triggeredModels.data
    }, [triggeredModels.data, triggeredModels.isSuccess])

    const pipelineTriggersSummary = React.useMemo(() => {
        if (!previousTriggeredPipelines.isSuccess) return null

        const triggeredPipelineIdList = triggeredPipelineList.map(e => e.pipelineId)

        return getPipelineTriggersSummary(
            triggeredPipelineList,
            previousTriggeredPipelines.data.filter(trigger =>
                triggeredPipelineIdList.includes(trigger.pipelineId)
            )
        )
    }, [previousTriggeredPipelines.data, triggeredPipelineList, previousTriggeredPipelines.isSuccess])

    const modelTriggersSummary = React.useMemo(() => {
        if (!previousTriggeredModels.isSuccess) return null

        const triggeredModelIdList = triggeredModelList.map(e => e.modelId)

        return getModelTriggersSummary(
            triggeredModelList,
            previousTriggeredModels.data.filter(trigger =>
                triggeredModelIdList.includes(trigger.modelId)
            )
        )
    }, [previousTriggeredModels.data, triggeredModelList, previousTriggeredModels.isSuccess])

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-end items-center sm:items-center mb-5">
                <FilterByDay
                    refetch={() => {
                        pipelinesChart.refetch()
                        modelsChart.refetch()
                    }}
                    selectedTimeOption={selectedTimeOption}
                    setSelectedTimeOption={setSelectedTimeOption}
                />
            </div>
            <div className="w-full flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-1/2">
                    <PipelineTriggerCountsLineChart
                        isLoading={pipelinesChart.isLoading}
                        pipelines={pipelinesChartList}
                        selectedTimeOption={selectedTimeOption}
                        pipelineTriggersSummary={pipelineTriggersSummary}
                        key={`pipeline-chart-${namespaceId}-${selectedTimeOption.value}`}
                    />
                </div>
                <div className="w-full lg:w-1/2">
                    <ModelsTriggerCountsLineChart
                        isLoading={modelsChart.isLoading}
                        models={modelChartList}
                        selectedTimeOption={selectedTimeOption}
                        modelTriggersSummary={modelTriggersSummary}
                        key={`model-chart-${namespaceId}-${selectedTimeOption.value}`}
                    />
                </div>
            </div>
        </div>
    )
}
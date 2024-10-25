"use client"

import * as React from "react"
import { Icons, Popover, SelectOption } from "@instill-ai/design-system"
import { useRouter, usePathname } from "next/navigation"
import { FilterByDay } from "./FilterByDay"
import { DashboardListPipeline } from "./cost/pipeline/DashboardListPipeline"
import { DashboardListModel } from "./cost/model/DashboardListModel"
import { useCreditConsumptionChartRecords } from "../../lib"
import { CreditCostTrendChart } from "./cost/CreditCostTrendChart"
import { Nullable } from "instill-sdk"

type CostTabProps = {
    selectedTimeOption: SelectOption
    setSelectedTimeOption: React.Dispatch<React.SetStateAction<SelectOption>>
    accessToken: Nullable<string>
    enabledQuery: boolean
    namespaceId: Nullable<string>
}

type ChartData = {
    dates: string[]
    values: number[]
}

export const CostTab = ({
    selectedTimeOption,
    setSelectedTimeOption,
    accessToken,
    enabledQuery,
    namespaceId,
}: CostTabProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const costView = pathname.includes("/cost/model") ? "model" : "pipeline"

    const start = React.useMemo(() => {
        if (selectedTimeOption.value === "24h") {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            return today.toISOString()
        }
        const date = new Date()
        date.setDate(date.getDate() - parseInt(selectedTimeOption.value))
        return date.toISOString()
    }, [selectedTimeOption.value])

    const stop = React.useMemo(() => {
        return new Date().toISOString()
    }, [])

    const creditConsumption = useCreditConsumptionChartRecords({
        enabled: enabledQuery && Boolean(namespaceId),
        accessToken,
        namespaceId,
        start,
        stop,
        aggregationWindow: selectedTimeOption.value === "24h" ? "1h" : "24h",
    })

    const chartData: ChartData = React.useMemo(() => {
        const record = creditConsumption.data?.creditConsumptionChartRecords?.find(
            (record) => record.source === costView
        )
        if (record) {
            return {
                dates: record.timeBuckets,
                values: record.amount,
            }
        }
        return { dates: [], values: [] }
    }, [creditConsumption.data, costView])

    const options = [
        {
            value: "pipeline",
            label: "Pipeline",
            icon: <Icons.Pipeline className="h-4 w-4" />,
        },
        {
            value: "model",
            label: "Model",
            icon: <Icons.Model className="h-4 w-4" />,
        },
    ]

    const handleOptionClick = (optionValue: string) => {
        router.push(`/${namespaceId}/dashboard/cost/${optionValue}`)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <div className="flex space-x-3">
                    <Popover.Root>
                        <Popover.Trigger asChild>
                            <button className="flex flex-row gap-x-2 rounded border border-semantic-bg-line bg-semantic-bg-primary px-4 py-3 text-semantic-fg-primary product-button-button-1">
                                {options.find((o) => o.value === costView)?.label}
                                <Icons.ChevronDown className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
                            </button>
                        </Popover.Trigger>
                        <Popover.Content align="start" className="flex w-48 flex-col !px-0 py-1">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    className={`flex items-center p-2 hover:bg-semantic-bg-line ${costView === option.value ? "bg-semantic-bg-line" : ""
                                        }`}
                                    onClick={() => handleOptionClick(option.value)}
                                >
                                    {option.icon}
                                    <span className="ml-2">{option.label}</span>
                                    {costView === option.value && (
                                        <Icons.Check className="ml-auto h-4 w-4 stroke-semantic-fg-primary" />
                                    )}
                                </button>
                            ))}
                        </Popover.Content>
                    </Popover.Root>
                </div>
                <FilterByDay
                    refetch={() => creditConsumption.refetch()}
                    selectedTimeOption={selectedTimeOption}
                    setSelectedTimeOption={setSelectedTimeOption}
                />
            </div>

            <div className="mb-2 w-full">
                <CreditCostTrendChart
                    dates={chartData.dates}
                    values={chartData.values}
                    isLoading={creditConsumption.isLoading}
                    namespaceId={namespaceId}
                    type={costView}
                    key={`chart-${namespaceId}-${costView}`}
                />
            </div>

            <div className="mt-8">
                {costView === "model" ? (
                    <DashboardListModel namespaceId={namespaceId} key={`model-list-${namespaceId}`} />
                ) : (
                    <DashboardListPipeline namespaceId={namespaceId} key={`pipeline-list-${namespaceId}`} />
                )}
            </div>
        </div>
    )
}
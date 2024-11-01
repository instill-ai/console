"use client"

import * as React from "react"
import { Icons, Popover, SelectOption } from "@instill-ai/design-system"
import { useRouter, usePathname } from "next/navigation"
import { FilterByDay } from "../FilterByDay"
import { DashboardListPipeline } from "./pipeline/DashboardListPipeline"
import { DashboardListModel } from "./model/DashboardListModel"
import { Nullable } from "instill-sdk"
import { useAuthenticatedUser, useCreditConsumptionChartRecords } from "../../../lib"
import { CreditCostTrendChart } from "./CreditCostTrendChart"
import { formatDateToRFC3339, getStartOfDay } from "../helpers"

type CostTabProps = {
    selectedTimeOption: SelectOption
    setSelectedTimeOption: React.Dispatch<React.SetStateAction<SelectOption>>
    accessToken: Nullable<string>
    enabledQuery: boolean
}

export const CostTab = ({
    selectedTimeOption,
    setSelectedTimeOption,
    accessToken,
    enabledQuery,
}: CostTabProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const costView = pathname.includes("/cost/model") ? "model" : "pipeline"

    const me = useAuthenticatedUser({
        enabled: enabledQuery,
        accessToken,
    })

    // Calculate start date based on selected time option
    const start = React.useMemo(() => {
        if (selectedTimeOption.value === "24h") {
            // For today, start at 00:00:00.000
            return getStartOfDay(new Date())
        }

        // For other periods, calculate days back and start at 00:00:00.000
        const date = new Date()
        date.setDate(date.getDate() - parseInt(selectedTimeOption.value))
        return getStartOfDay(date)
    }, [selectedTimeOption.value])

    // Calculate stop date (current time with milliseconds)
    const stop = React.useMemo(() => {
        return formatDateToRFC3339(new Date())
    }, [])

    const creditConsumption = useCreditConsumptionChartRecords({
        enabled: enabledQuery,
        accessToken,
        namespaceId: me.data?.id ?? "",
        start,
        stop,
        aggregationWindow: selectedTimeOption.value === "24h" || selectedTimeOption.value === "1d" ? "1h" : "24h",
    })

    const chartData = React.useMemo(() => {
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
                                    className={`flex items-center p-2 hover:bg-semantic-bg-line ${costView === option.value ? "bg-semantic-bg-line" : ""}`}
                                    onClick={() => {
                                        router.push(`/${me?.data?.id}/dashboard/cost/${option.value}`)
                                    }}
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
            <div className="mb-10 w-full">
                <CreditCostTrendChart
                    key={costView}
                    dates={chartData.dates}
                    values={chartData.values}
                    isLoading={creditConsumption.isLoading}
                    type={costView}
                />
            </div>
            {costView === "model" ? <DashboardListModel start={start} /> : <DashboardListPipeline start={start} />}
        </div>
    )
}
"use client"

import * as React from "react"
import * as echarts from "echarts"
import { Icons, Tooltip } from "@instill-ai/design-system"
import Link from "next/link"
import { Nullable } from "instill-sdk"

type CreditCostTrendChartProps = {
    dates: string[]
    values: number[]
    isLoading: boolean
    namespaceId: Nullable<string>
    type: "model" | "pipeline"
}

export const CreditCostTrendChart = ({
    dates,
    values,
    isLoading,
    namespaceId,
    type,
}: CreditCostTrendChartProps) => {
    const chartRef = React.useRef<HTMLDivElement>(null)
    const chartInstanceRef = React.useRef<Nullable<echarts.ECharts>>(null)

    const chartColor = type === "model" ? "#2EC291" : "#3B7AF7"

    React.useEffect(() => {
        if (!chartRef.current || dates.length === 0) return

        if (chartInstanceRef.current) {
            chartInstanceRef.current.dispose()
        }

        const chart = echarts.init(chartRef.current, null, {
            renderer: "svg",
        })

        chartInstanceRef.current = chart

        const option = {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
                formatter: function (params: { axisValue: string; value: number }[]) {
                    const date = new Date(params[0]?.axisValue ?? "")
                    const formattedDate = `${date.getDate()} ${date.toLocaleString(
                        "default",
                        { month: "short" }
                    )}, ${date.getFullYear()} - ${date.toTimeString().split(" ")[0]}`
                    const value = params[0]?.value ?? 0

                    return `
            <div style="font-size: 14px; color: #666;">
              <div class="product-body-text-4-medium" style="margin-bottom: 5px;">${formattedDate}</div>
              <div style="display: flex; align-items: center; margin-bottom: 3px;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${chartColor}"></span>
                <div class="product-body-text-3-medium" style="margin-left: 15px;">${value.toFixed(2)} credits</div>
              </div>
            </div>
          `
                },
            },
            xAxis: {
                type: "category",
                data: dates,
                axisLabel: {
                    formatter: (value: string) => {
                        const date = new Date(value)
                        return `${date.getDate()} ${date.toLocaleString("default", {
                            month: "short",
                        })}`
                    },
                },
            },
            yAxis: {
                type: "value",
                name: "Credits",
            },
            series: [
                {
                    name: type === "model" ? "Model" : "Pipeline",
                    type: "bar",
                    data: values,
                    itemStyle: { color: chartColor },
                    barWidth: "24px",
                },
            ],
        }

        chart.setOption(option)

        const handleResize = () => {
            chart?.resize()
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            if (chartInstanceRef.current) {
                chartInstanceRef.current.dispose()
                chartInstanceRef.current = null
            }
        }
    }, [dates, values, chartColor, type])

    React.useEffect(() => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.resize()
        }
    }, [isLoading])

    return (
        <div className="inline-flex w-full flex-col items-start justify-start rounded-sm bg-semantic-bg-primary shadow">
            <div className="flex flex-col items-start justify-start gap-[30px] self-stretch">
                <div className="inline-flex items-center justify-between gap-2.5 self-stretch pt-8 px-8">
                    <div className="flex items-center justify-start gap-2.5">
                        <div className="text-semantic-fg-primary product-headings-heading-2">
                            Credit Cost Trend
                        </div>
                        <Tooltip.Provider>
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <div className="relative h-4 w-4">
                                        <Icons.AlertCircle className="h-4 w-4 stroke-semantic-fg-primary" />
                                    </div>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                    <Tooltip.Content
                                        className="rounded-sm"
                                        sideOffset={5}
                                        side="right"
                                    >
                                        <div className="inline-flex w-80 flex-col items-start justify-start rounded-sm bg-semantic-bg-primary p-3">
                                            <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                                                <div className="self-stretch text-semantic-fg-primary product-body-text-4-semibold">
                                                    Credit Cost Trend
                                                </div>
                                                <div className="self-stretch text-semantic-fg-secondary product-body-text-4-medium">
                                                    View the trend of credit cost for {type}s over time.
                                                </div>
                                            </div>
                                        </div>
                                        <Tooltip.Arrow
                                            className="fill-semantic-bg-primary"
                                            offset={10}
                                            width={9}
                                            height={6}
                                        />
                                    </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        </Tooltip.Provider>
                    </div>
                    <Link
                        className="text-semantic-fg-secondary product-button-button-2 px-3 py-1 border border-semantic-fg-disabled rounded-full"
                        href={`/${namespaceId}/settings/billing/credits`}
                    >
                        View billing details
                    </Link>
                </div>
                <div className="px-8 pb-8 w-full" style={{ height: "460px" }}>
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <div
                            ref={chartRef}
                            style={{ width: "100%", height: "400px" }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
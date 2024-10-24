import * as React from "react";
import * as echarts from "echarts";
import { Icons, Tooltip, SelectOption } from "@instill-ai/design-system";
import { useCreditConsumptionChartRecords } from "../../lib/react-query-service/metric";
import { Nullable } from "instill-sdk";

type ModelCreditCostTrendChartProps = {
    isLoading: boolean;
    selectedTimeOption: SelectOption;
    accessToken: Nullable<string>;
    enabledQuery: boolean;
    namespaceId: Nullable<string>
};

export const ModelCreditCostTrendChart = ({
    isLoading,
    selectedTimeOption,
    accessToken,
    enabledQuery,
    namespaceId
}: ModelCreditCostTrendChartProps) => {
    const chartRef = React.useRef<HTMLDivElement>(null);

    const start = React.useMemo(() => {
        if (selectedTimeOption.value === "24h") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return today.toISOString();
        }
        const date = new Date();
        date.setDate(date.getDate() - parseInt(selectedTimeOption.value));
        return date.toISOString();
    }, [selectedTimeOption.value]);

    const stop = React.useMemo(() => {
        return new Date().toISOString();
    }, []);

    const creditConsumption = useCreditConsumptionChartRecords({
        enabled: enabledQuery,
        accessToken,
        namespaceId: namespaceId,
        start,
        stop,
        aggregationWindow: selectedTimeOption.value === "24h" ? "1h" : "24h",
    });


    const modelData = React.useMemo(() => {
        if (!creditConsumption.data) return { dates: [], values: [] };

        const modelRecord = creditConsumption.data.creditConsumptionChartRecords?.find(
            (record) => record.source === "model"
        );

        if (!modelRecord) return { dates: [], values: [] };

        return {
            dates: modelRecord.timeBuckets,
            values: modelRecord.amount,
        };
    }, [creditConsumption.data, isLoading]);

    React.useEffect(() => {
        if (chartRef.current && modelData.dates.length > 0) {
            const chart = echarts.init(chartRef.current, null, {
                renderer: "svg",
            });

            const option = {
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                    },
                    formatter: function (params: { axisValue: string; value: number }[]) {
                        const date = new Date(params[0]?.axisValue ?? "");
                        const formattedDate = `${date.getDate()} ${date.toLocaleString(
                            "default",
                            { month: "short" }
                        )}, ${date.getFullYear()} - ${date.toTimeString().split(" ")[0]}`;
                        const value = params[0]?.value ?? 0;

                        return `
                            <div style="font-size: 14px; color: #666;">
                                <div class="product-body-text-4-medium" style="margin-bottom: 5px;">${formattedDate}</div>
                                <div style="display: flex; align-items: center; margin-bottom: 3px;">
                                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #2EC291"></span>
                                    <div class="product-body-text-3-medium" style="margin-left: 15px;">${value.toFixed(2)} credits</div>
                                </div>
                            </div>
                        `;
                    },
                },
                xAxis: {
                    type: "category",
                    data: modelData.dates,
                    axisLabel: {
                        formatter: (value: string) => {
                            const date = new Date(value);
                            return `${date.getDate()} ${date.toLocaleString("default", {
                                month: "short",
                            })}`;
                        },
                    },
                },
                yAxis: {
                    type: "value",
                    name: "Credits",
                },
                series: [
                    {
                        name: "Model",
                        type: "bar",
                        data: modelData.values,
                        itemStyle: { color: "#2EC291" },
                        barWidth: "24px",
                    },
                ],
            };

            chart.setOption(option);

            return () => {
                chart.dispose();
            };
        }
    }, [modelData]);

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
                                        side={"right"}
                                    >
                                        <div className="inline-flex w-80 flex-col items-start justify-start rounded-sm bg-semantic-bg-primary p-3">
                                            <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                                                <div className="self-stretch text-semantic-fg-primary product-body-text-4-semibold">
                                                    Credit Cost Trend
                                                </div>
                                                <div className="self-stretch text-semantic-fg-secondary product-body-text-4-medium">
                                                    View the trend of credit cost for models over time.
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
                    <div className="text-semantic-fg-secondary product-button-button-2 px-3 py-1 border border-semantic-fg-disabled rounded-full">
                        View billing details
                    </div>
                </div>
                <div className="px-8 pb-8 w-full" style={{ height: '460px' }}>
                    <div
                        ref={chartRef}
                        style={{ width: "100%", height: "400px" }}
                    />
                </div>
            </div>
        </div>
    );
};
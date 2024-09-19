"use client";

import cn from "clsx";

type UsageSwitchProps = {
    activeTab: "activity" | "cost";
    setActiveTab: (tab: "activity" | "cost") => void;
};

export const UsageSwitch = ({
    activeTab,
    setActiveTab,
}: UsageSwitchProps) => {
    const options = [
        { value: "activity", label: "Activity" },
        { value: "cost", label: "Cost" },
    ];

    return (
        <div className="flex space-x-1 mb-2 bg-semantic-bg-secondary p-1 rounded-sm border-semantic-bg-line w-fit border">
            {options.map((option) => (
                <button
                    key={option.value}
                    className={cn(
                        "flex items-center justify-center px-4 py-2 rounded transition-all duration-200 ease-in-out product-body-text-3-semibold",
                        option.value === activeTab
                            ? "bg-semantic-bg-primary shadow text-semantic-fg-primary"
                            : "bg-transparent text-semantic-fg-disabled hover:bg-semantic-bg-line"
                    )}
                    onClick={() => setActiveTab(option.value as "activity" | "cost")}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

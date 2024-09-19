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
        <div className="flex flex-row space-x-4 mb-8">
            <div className="border-semantic flex items-start justify-start">
                {options.map((option) => (
                    <button
                        key={option.value}
                        className={cn(
                            "my-auto flex !h-10 cursor-pointer items-center justify-center self-stretch !px-4 !py-1 outline outline-1 outline-semantic-bg-line first:rounded-l-[2px] last:rounded-r-[2px] hover:bg-semantic-bg-secondary",
                            option.value === activeTab
                                ? "bg-semantic-bg-line"
                                : "bg-white",
                        )}
                        onClick={() => setActiveTab(option.value as "activity" | "cost")}
                    >
                        <p className="text-semantic-fg-primary product-body-text-4-semibold">
                            {option.label}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};
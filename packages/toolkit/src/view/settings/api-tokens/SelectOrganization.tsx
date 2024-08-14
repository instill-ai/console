"use client";

import * as React from "react";
import { Select, Icons } from "@instill-ai/design-system";

const organizations = [
    { id: "1", name: "Organization 1" },
    { id: "2", name: "Organization 2" },
    { id: "3", name: "Organization 3" },
];

export const SelectOrganization = () => {
    const [selectedOrg, setSelectedOrg] = React.useState(organizations[0]?.id);

    React.useEffect(() => {
        console.log("Selected organization:", selectedOrg);
    }, [selectedOrg]);

    return (
        <Select.Root value={selectedOrg} onValueChange={setSelectedOrg}>
            <Select.Trigger className="flex items-center justify-between w-full p-4 bg-white border border-slate-200 rounded-lg text-semantic-fg-primary hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400">
                <div className="flex items-center">
                    <Select.Value >Select an organization</Select.Value>
                </div>
                <Icons.ChevronDown className="w-4 h-4 text-semantic-fg-secondary" />
            </Select.Trigger>
            <Select.Content className="w-full bg-white border border-slate-200 rounded-md shadow-lg">
                {organizations.map((org) => (
                    <Select.Item
                        key={org.id}
                        value={org.id}
                        className="flex items-center p-3 hover:bg-slate-100 cursor-pointer"
                    >
                        <Select.ItemText>{org.name}</Select.ItemText>
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    );
};


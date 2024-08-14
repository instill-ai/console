"use client";

import * as React from "react";
import { Select, Icons } from "@instill-ai/design-system";
import { CodeBlock } from "../../../components";
import { defaultCodeSnippetStyles } from "../../../constant";

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
        <div className="flex gap-4 p-4 rounded border border-semantic-bg-line">
            <Icons.AlertCircle className="w-6 h-6 stroke-semantic-node-connector-on" />
            <div className="flex flex-col flex-1 gap-3">
                <p className=" text-semantic-fg-secondary product-body-text-3-regular">
                    API tokens are tied to individual users, not organizations. To
                    charge an organization for an API request, include the{" "}
                    <span className="product-body-text-3-medium">Instill-Requester-Uid</span> header. If
                    you omit this header, personal credits will be used. For more
                    details, refer to the{" "}
                    <a href="/docs/api-tokens" className="text-semantic-accent-default">
                        documentation
                    </a>
                    .
                </p>
                <div className="flex gap-2 items-center">
                    <p className="product-button-button-2 text-semantic-fg-secondary">
                        Organization:
                    </p>
                    <Select.Root value={selectedOrg} onValueChange={setSelectedOrg}>
                        <Select.Trigger className="flex gap-2 items-center px-2.5 py-1.5 text-xs leading-none bg-semantic-bg-primary rounded border border-semantic-bg-line min-w-[240px] text-semantic-fg-primary w-[280px]">
                            <Select.Value placeholder="Select an organization" />
                        </Select.Trigger>
                        <Select.Content viewportClassName="!p-0">
                            {organizations.map((org) => (
                                <Select.Item
                                    key={org.id}
                                    value={org.id}
                                >
                                    <Select.ItemText>{org.name}</Select.ItemText>
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Root>
                </div>
                {/* <div className="flex gap-2 items-center px-2.5 py-1.5 bg-semantic-bg-primary rounded border border-semantic-bg-line">
                    <p className="flex-1 text-sm leading-none text-semantic-secondary-pressed">
                        --header &quot;Instill-Requester-Uid:
                        $INSTILL_ORGANZATION_UID&quot;
                    </p>
                    <button className="flex items-center justify-center p-2 w-8 h-8 bg-semantic-bg-primary rounded border border-semantic-bg-line">
                        <Icons.Copy06 className="w-4 h-4 stroke-semantic-fg-secondary" />
                    </button>
                </div> */}
                <CodeBlock
                    codeString={"--header Instill-Requester-Uid:$INSTILL_ORGANZATION_UID"}
                    wrapLongLines={true}
                    language="bash"
                    customStyle={defaultCodeSnippetStyles}
                />
            </div>
        </div>
    );
};

export default SelectOrganization;
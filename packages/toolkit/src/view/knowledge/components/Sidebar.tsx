// Sidebar.tsx
import { Nullable, TabMenu } from "@instill-ai/design-system";
import * as React from "react";
export const Sidebar = () => {
    const [activeTab, setActiveTab] = React.useState<Nullable<string>>("my-knowledge-bases");

    return (
        <aside className="flex flex-col w-[160px] gap-y-4">
            <div
                className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${activeTab === "my-knowledge-bases"
                    ? "bg-semantic-accent-bg text-semantic-accent-hover"
                    : "text-semantic-fg-secondary"
                    }`}
                onClick={() => setActiveTab("my-knowledge-bases")}
            >
                My Knowledge Bases
            </div>
            <div
                className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${activeTab === "upload-explore"
                    ? "bg-semantic-accent-bg text-semantic-accent-hover"
                    : "text-semantic-fg-secondary"
                    }`}
                onClick={() => setActiveTab("upload-explore")}
            >
                Upload & Explore
            </div>
            <div
                className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${activeTab === "catalog-files"
                    ? "bg-semantic-accent-bg text-semantic-accent-hover"
                    : "text-semantic-fg-secondary"
                    }`}
                onClick={() => setActiveTab("catalog-files")}
            >
                Catalog / Files
            </div>
            <div
                className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${activeTab === "retrieve-test"
                    ? "bg-semantic-accent-bg text-semantic-accent-hover"
                    : "text-semantic-fg-secondary"
                    }`}
                onClick={() => setActiveTab("retrieve-test")}
            >
                Retrieve Test
            </div>
        </aside>
    );
};
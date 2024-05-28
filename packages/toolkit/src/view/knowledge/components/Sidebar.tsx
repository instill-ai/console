// Sidebar.tsx
import * as React from "react";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/knowledgeBase";

type SidebarProps = {
    selectedKnowledgeBase: KnowledgeBase | null;
};

export const Sidebar = ({ selectedKnowledgeBase }: SidebarProps) => {
    return (
        <aside className="flex flex-col w-[160px] gap-y-4">
            <div
                className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${selectedKnowledgeBase
                        ? "text-semantic-fg-secondary"
                        : "bg-semantic-accent-bg text-semantic-accent-hover"
                    }`}
            >
                My Knowledge Bases
            </div>
            <div
                className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${selectedKnowledgeBase
                        ? "bg-semantic-accent-bg text-semantic-accent-hover"
                        : "text-semantic-fg-secondary cursor-not-allowed opacity-50"
                    }`}
            >
                Upload & Explore
            </div>
            <div
                className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${selectedKnowledgeBase
                        ? "bg-semantic-accent-bg text-semantic-accent-hover"
                        : "text-semantic-fg-secondary cursor-not-allowed opacity-50"
                    }`}
            >
                Catalog / Files
            </div>
            <div
                className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${selectedKnowledgeBase
                        ? "bg-semantic-accent-bg text-semantic-accent-hover"
                        : "text-semantic-fg-secondary cursor-not-allowed opacity-50"
                    }`}
            >
                Retrieve Test
            </div>
        </aside>
    );
};
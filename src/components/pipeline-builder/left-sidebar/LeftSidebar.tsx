import cn from "clsx";
import { ConnectorType, Nullable } from "@instill-ai/toolkit";
import { Dispatch, SetStateAction } from "react";
import { Icons } from "@instill-ai/design-system";

export type LeftSidebarProps = {
  selectedTab: Nullable<ConnectorType>;
  setSelectedTab: Dispatch<SetStateAction<Nullable<ConnectorType>>>;
};

export const LeftSidebar = (props: LeftSidebarProps) => {
  const { selectedTab, setSelectedTab } = props;

  return (
    <div className="mb-auto flex flex-col space-y-2 pt-8">
      <button
        onClick={() =>
          setSelectedTab((prev) =>
            prev === "CONNECTOR_TYPE_SOURCE" ? null : "CONNECTOR_TYPE_SOURCE"
          )
        }
        className={cn(
          "mx-auto flex flex-col rounded-xs border border-transparent p-1 hover:bg-semantic-bg-base-bg",
          {
            "!border-semantic-accent-default border-opacity-100 bg-semantic-accent-bg hover:bg-semantic-accent-bg":
              selectedTab === "CONNECTOR_TYPE_SOURCE",
          }
        )}
      >
        <div className="flex flex-col items-center px-1">
          <div className="flex h-10 w-10 items-center justify-center">
            <Icons.Database01 className="h-6 w-6 stroke-semantic-fg-primary" />
          </div>
          <p className="font-sans text-semantic-fg-primary product-label-label-2">
            Source
          </p>
        </div>
      </button>
      <button
        onClick={() =>
          setSelectedTab((prev) =>
            prev === "CONNECTOR_TYPE_AI" ? null : "CONNECTOR_TYPE_AI"
          )
        }
        className={cn(
          "mx-auto flex flex-col rounded-xs border border-transparent p-1 hover:bg-semantic-bg-base-bg",
          {
            "!border-semantic-accent-default border-opacity-100 bg-semantic-accent-bg hover:bg-semantic-accent-bg":
              selectedTab === "CONNECTOR_TYPE_AI",
          }
        )}
      >
        <div className="flex flex-col items-center px-1">
          <div className="flex h-10 w-10 items-center justify-center">
            <Icons.Model className="h-6 w-6 stroke-semantic-fg-primary" />
          </div>
          <p className="font-sans text-semantic-fg-primary product-label-label-2">
            AI
          </p>
        </div>
      </button>
      <button
        onClick={() =>
          setSelectedTab((prev) =>
            prev === "CONNECTOR_TYPE_BLOCKCHAIN"
              ? null
              : "CONNECTOR_TYPE_BLOCKCHAIN"
          )
        }
        className={cn(
          "mx-auto flex flex-col rounded-xs border border-transparent p-1 hover:bg-semantic-bg-base-bg",
          {
            "!border-semantic-accent-default border-opacity-100 bg-semantic-accent-bg hover:bg-semantic-accent-bg":
              selectedTab === "CONNECTOR_TYPE_BLOCKCHAIN",
          }
        )}
      >
        <div className="flex flex-col items-center px-1">
          <div className="flex h-10 w-10 items-center justify-center">
            <Icons.CubeOutline className="h-6 w-6 stroke-semantic-fg-primary" />
          </div>
          <p className="font-sans text-semantic-fg-primary product-label-label-2">
            Blockchain
          </p>
        </div>
      </button>
      <button
        onClick={() =>
          setSelectedTab((prev) =>
            prev === "CONNECTOR_TYPE_DESTINATION"
              ? null
              : "CONNECTOR_TYPE_DESTINATION"
          )
        }
        className={cn(
          "mx-auto flex flex-col rounded-xs border border-transparent p-1 hover:bg-semantic-bg-base-bg",
          {
            "!border-semantic-accent-default border-opacity-100 bg-semantic-accent-bg hover:bg-semantic-accent-bg":
              selectedTab === "CONNECTOR_TYPE_DESTINATION",
          }
        )}
      >
        <div className="flex flex-col items-center px-1">
          <div className="flex h-10 w-10 items-center justify-center">
            <Icons.Box className="h-6 w-6 stroke-semantic-fg-primary" />
          </div>
          <p className="font-sans text-semantic-fg-primary product-label-label-2">
            Destination
          </p>
        </div>
      </button>
    </div>
  );
};

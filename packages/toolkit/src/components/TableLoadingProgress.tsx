"use client";

import cn from "clsx";

import { Nullable } from "../lib";
import { LoadingSpin } from "./LoadingSpin";

export type TableLoadingProgressProps = {
  marginBottom: Nullable<string>;
};

export const TableLoadingProgress = ({
  marginBottom,
}: TableLoadingProgressProps) => {
  return (
    <div
      className={cn(
        "border-instillGrey20 flex min-h-[300px] w-full border bg-white",
        marginBottom,
      )}
    >
      <div className="m-auto flex flex-col gap-y-2.5">
        <div className="m-auto flex h-[72px] w-[72px]">
          <LoadingSpin className="text-semantic-fg-primary" />
        </div>
        <p className="text-instill-small mx-auto text-semantic-node-disconnected-default-stroke">
          loading...
        </p>
      </div>
    </div>
  );
};

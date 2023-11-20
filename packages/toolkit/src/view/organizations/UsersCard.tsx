import { Icons } from "@instill-ai/design-system";
import * as React from "react";

export type UsersCardProps = {
  members: string[];
};

export const UsersCard = ({ members }: UsersCardProps) => {
  return (
    <div className="flex flex-grow">
      <div className="my-auto pr-3">
        <p className="text-semantic-fg-disabled product-body-text-3-regular">
          15
        </p>
      </div>
      <div className="my-auto mr-[-5px] flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
        <Icons.User02 className="h-3 w-3 stroke-slate-500" />
      </div>
      <div className="my-auto mr-[-5px] flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
        <Icons.User02 className="h-3 w-3 stroke-slate-500" />
      </div>
      <div className="my-auto mr-[-5px] flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
        <Icons.User02 className="h-3 w-3 stroke-slate-500" />
      </div>
      <div className="my-auto mr-[-5px] flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
        <Icons.User02 className="h-3 w-3 stroke-slate-500" />
      </div>
      <div className="my-auto flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-gray-800">
        <p className="text-white product-body-text-4-regular">11+</p>
      </div>
    </div>
  );
};

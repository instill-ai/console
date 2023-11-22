import { Icons } from "@instill-ai/design-system";
import * as React from "react";

export type TeamMembersCardProps = {
  members: string[];
};

export const TeamMembersCard = ({ members }: TeamMembersCardProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row">
        <div className="my-auto mr-[-5px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
          <Icons.User02 className="h-6 w-6 stroke-slate-500" />
        </div>
        <div className="my-auto mr-[-5px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
          <Icons.User02 className="h-6 w-6 stroke-slate-500" />
        </div>
        <div className="my-auto mr-[-5px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
          <Icons.User02 className="h-6 w-6 stroke-slate-500" />
        </div>
        <div className="my-auto mr-[-5px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
          <Icons.User02 className="h-6 w-6 stroke-slate-500" />
        </div>
        <div className="my-auto mr-[-5px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
          <Icons.User02 className="h-6 w-6 stroke-slate-500" />
        </div>
        <div className="my-auto mr-[-5px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
          <Icons.User02 className="h-6 w-6 stroke-slate-500" />
        </div>
        <div className="my-auto mr-[-5px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
          <Icons.User02 className="h-6 w-6 stroke-slate-500" />
        </div>
      </div>
      <div className="flex flex-row">
        <div className="my-auto mr-[-5px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
          <Icons.User02 className="h-6 w-6 stroke-slate-500" />
        </div>
        <div className="my-auto mr-[-5px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
          <Icons.User02 className="h-6 w-6 stroke-slate-500" />
        </div>
        <div className="my-auto mr-[-5px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
          <Icons.User02 className="h-6 w-6 stroke-slate-500" />
        </div>
        <div className="my-auto mr-[-5px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
          <Icons.User02 className="h-6 w-6 stroke-slate-500" />
        </div>
        <div className="my-auto mr-[-5px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
          <Icons.User02 className="h-6 w-6 stroke-slate-500" />
        </div>
        <div className="my-auto mr-[-5px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-200">
          <Icons.User02 className="h-6 w-6 stroke-slate-500" />
        </div>
        <div className="my-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-gray-800">
          <p className="text-white product-body-text-2-regular">11+</p>
        </div>
      </div>
    </div>
  );
};

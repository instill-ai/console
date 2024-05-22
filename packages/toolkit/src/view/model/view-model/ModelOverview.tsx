import { Model } from "../../../lib";
import { ModelReadme } from "./ModelReadme";

export type ModelOverviewProps = {
  model?: Model;
};

export const ModelOverview = ({ model }: ModelOverviewProps) => {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-row gap-x-6">
        <div className="flex flex-1 flex-col">left</div>
        <div className="flex flex-1 flex-col">right</div>
      </div>
      <div>
        <h2 className="mb-5 min-w-full rounded bg-semantic-bg-base-bg px-3 py-2.5 text-lg font-medium text-black">
          Readme
        </h2>
        <ModelReadme model={model} />
      </div>
    </div>
  );
};

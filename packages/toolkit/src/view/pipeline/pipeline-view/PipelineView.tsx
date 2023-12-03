import { PipelineViewHead } from "./PipelineViewHead";
import { PipelineViewReadme } from "./PipelineViewReadme";
import { ReadOnlyPipelineBuilder } from "./ReadOnlyPipelineBuilder";

export const PipelineView = () => {
  return (
    <div className="flex flex-col">
      <PipelineViewHead />
      <div className="flex flex-row pl-8 pr-32">
        <div className="flex w-3/5 flex-col py-10 pl-4">
          <ReadOnlyPipelineBuilder />
          <PipelineViewReadme />
        </div>
      </div>
    </div>
  );
};

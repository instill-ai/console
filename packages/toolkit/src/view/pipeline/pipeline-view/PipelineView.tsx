import { Head } from "./Head";
import { InOutPut } from "./InOutPut";
import { Readme } from "./Readme";
import { ReadOnlyPipelineBuilder } from "./ReadOnlyPipelineBuilder";

export const PipelineView = () => {
  return (
    <div className="flex h-full flex-col">
      <Head />
      <div className="flex flex-1 flex-row pl-8 pr-32">
        <div className="flex h-full w-[718px] flex-col gap-y-6 py-10 pl-4">
          <ReadOnlyPipelineBuilder />
          <Readme />
        </div>
        <div className="flex w-[506px] flex-col py-10 pr-4">
          <InOutPut />
        </div>
      </div>
    </div>
  );
};

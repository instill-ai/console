import { Icons } from "@instill-ai/design-system";

export const InOutputEmptyView = () => {
  return (
    <div className="flex w-full relative h-full bg-semantic-bg-alt-primary">
      <img
        src="/images/empty-placeholder.svg"
        alt="Grid"
        className="min-w-full min-h-full"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col">
          <div className="flex mx-auto items-center mb-5 justify-center rounded-sm border w-12 h-12 bg-semantic-fg-on-default border-semantic-bg-line shadow-[0_0_2_0_rgba(0,0,0,0.08)]">
            <Icons.AlertCircle className="h-6 w-6 stroke-semantic-fg-primary" />
          </div>

          <div className="flex flex-col gap-y-2 max-w-[512px]">
            <p className="font-semibold text-xl text-semantic-fg-primary text-center">
              Pipeline is not runnable
            </p>
            <p className="text-semantic-fg-secondary text-center">
              This pipeline cannot be run. Please check the configuration and
              ensure all necessary components are set up correctly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

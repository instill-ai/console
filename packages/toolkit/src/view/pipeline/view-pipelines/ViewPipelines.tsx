import { CardUserProfile } from "./CardUserProfile";

export const ViewPipelines = () => {
  return (
    <div className="flex flex-row">
      <div className="w-[288px] pr-4 pt-6">
        <CardUserProfile />
      </div>
      <div className="w-[630px] gap-y-4 pt-6"></div>
    </div>
  );
};

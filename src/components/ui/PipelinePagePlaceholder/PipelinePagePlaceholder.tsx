import { useRouter } from "next/router";
import { FC } from "react";
import { PrimaryButton } from "../Buttons";

const PipelinePagePlaceholder: FC = () => {
  const router = useRouter();
  const handleOnClick = () => {
    router.push("/pipelines/create");
  };
  return (
    <div className="flex h-[300px] w-full border border-instillGrey15 bg-white">
      <div className="m-auto flex gap-y-5">
        <h3 className="instill-text-h3 text-instillGrey80">No Pipeline</h3>
        <PrimaryButton disabled={false} onClickHandler={handleOnClick}>
          Create first pipeline
        </PrimaryButton>
      </div>
    </div>
  );
};

export default PipelinePagePlaceholder;

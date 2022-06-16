import { FC } from "react";

const FormVerticalDividers: FC = () => {
  return (
    <div className="relative mx-5 h-full w-6">
      <p className="text-instill-h3 absolute top-5 z-10 bg-instillGrey05">OR</p>
      <div className="absolute left-1/2 h-full border-r"></div>
    </div>
  );
};

export default FormVerticalDividers;

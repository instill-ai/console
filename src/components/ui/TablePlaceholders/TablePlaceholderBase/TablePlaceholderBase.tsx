import { FC, ReactElement } from "react";
import { useRouter } from "next/router";

import { PrimaryButton } from "../../Buttons";

export type TablePlaceholderBaseProps = {
  placeholder: ReactElement;
  createButtonLink: string;
};

const TablePlaceholderBase: FC<TablePlaceholderBaseProps> = ({
  placeholder,
  createButtonLink,
}) => {
  const router = useRouter();
  const handleOnClick = () => {
    router.push(createButtonLink);
  };
  return (
    <div className="flex h-[300px] w-full flex-row border border-instillGrey15 bg-white">
      {placeholder}
      <div className="m-auto flex gap-y-5">
        <h3 className="instill-text-h3 text-instillGrey80">No Pipeline</h3>
        <PrimaryButton
          type="button"
          disabled={false}
          onClickHandler={handleOnClick}
        >
          Create first pipeline
        </PrimaryButton>
      </div>
    </div>
  );
};

export default TablePlaceholderBase;

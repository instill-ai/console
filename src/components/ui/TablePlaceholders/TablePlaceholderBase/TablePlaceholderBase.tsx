import { FC, Fragment, ReactElement } from "react";
import { useRouter } from "next/router";

import { PrimaryButton } from "../../Buttons";

export type TablePlaceholderBaseProps = {
  placeholderItems: {
    id: string;
    item: ReactElement;
  }[];
  createButtonLink: string;
};

const TablePlaceholderBase: FC<TablePlaceholderBaseProps> = ({
  placeholderItems,
  createButtonLink,
}) => {
  const router = useRouter();
  const handleOnClick = () => {
    router.push(createButtonLink);
  };
  return (
    <div className="flex h-[300px] w-full flex-row border border-instillGrey15 bg-white px-[9px] py-[18px]">
      <div className="grid grid-cols-3 grid-rows-2 gap-x-2 gap-y-2 px-[27px] opacity-10">
        {placeholderItems.map((e) => (
          <Fragment key={e.id}>{e.item}</Fragment>
        ))}
      </div>
      <div className="m-auto flex flex-col gap-y-5">
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

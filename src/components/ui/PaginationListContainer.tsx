import cn from "clsx";
import { Nullable } from "@/types/general";
import { BasicTextField, SolidButton } from "@instill-ai/design-system";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction } from "react";

export type PaginationListContainerProps = {
  title: string;
  description: string;
  children?: ReactNode;
  currentPage: number;
  totalPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  searchTerm: Nullable<string>;
  setSearchTerm: Dispatch<SetStateAction<Nullable<string>>>;
  displaySearchField: boolean;
  marginBottom: Nullable<string>;
};

export const PaginationListContainer = ({
  title,
  description,
  children,
  currentPage,
  setCurrentPage,
  totalPage,
  searchTerm,
  setSearchTerm,
  displaySearchField,
  marginBottom,
}: PaginationListContainerProps) => {
  return (
    <div className={cn("flex w-full flex-col", marginBottom)}>
      <div className="flex flex-row border-x border-t border-instillGrey20 bg-white py-5 px-6">
        <div className="my-auto mr-auto flex flex-col">
          <h2 className="text-[#101828] text-instill-h2">{title}</h2>
          <p>{description}</p>
        </div>
        <div className="ml-auto">
          {displaySearchField ? (
            <BasicTextField
              id="searchTerm"
              label={null}
              value={searchTerm}
              placeholder={`Search ${title.toLowerCase()}`}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(event.target.value.trim())
              }
            />
          ) : null}
        </div>
      </div>
      {children}
      <div className="flex flex-row border-x border-b border-instillGrey20 py-5 px-6">
        <p className="my-auto mr-auto">{`Page ${
          totalPage === 0 ? 0 : currentPage + 1
        } of ${totalPage}`}</p>
        {totalPage > 1 ? (
          <div className="flex flex-row gap-x-3">
            <SolidButton
              onClickHandler={() => setCurrentPage((state) => (state -= 1))}
              disabled={currentPage - 1 >= 0 ? false : true}
              type="button"
              color="white"
            >
              Previous
            </SolidButton>
            <SolidButton
              onClickHandler={() => setCurrentPage((state) => (state += 1))}
              disabled={currentPage + 1 < totalPage ? false : true}
              type="button"
              color="white"
            >
              Next
            </SolidButton>
          </div>
        ) : null}
      </div>
    </div>
  );
};

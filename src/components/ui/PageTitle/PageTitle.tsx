import { useRouter } from "next/router";
import { FC, useCallback } from "react";
import Breadcrumb, { BreadcrumbProps } from "../Breadcrumb";
import { PrimaryButton } from "../Buttons";

export type PageTitleProps = {
  title: string;
  buttonName: string;
  buttonLink: string;
  breadcrumbs: BreadcrumbProps["breadcrumbs"];
};

const PageTitle: FC<PageTitleProps> = ({
  title,
  buttonName,
  buttonLink,
  breadcrumbs,
}) => {
  const router = useRouter();
  const onClickHandler = useCallback(() => {
    router.push(buttonLink);
  }, [router]);
  return (
    <div className="flex flex-col">
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <div className="flex flex-row">
        <h2 className="instill-text-h2 mt-auto mr-auto text-black">{title}</h2>
        <PrimaryButton
          type="button"
          disabled={false}
          onClickHandler={onClickHandler}
        >
          {buttonName}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default PageTitle;

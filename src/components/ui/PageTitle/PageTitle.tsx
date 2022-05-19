import { useRouter } from "next/router";
import { FC, useCallback } from "react";
import Breadcrumb, { BreadcrumbProps } from "../Breadcrumb";
import { PrimaryButton } from "../Buttons";
import cn from "clsx";

export type PageTitleProps = {
  title: string;
  enableButton: boolean;
  buttonName?: string;
  buttonLink?: string;
  breadcrumbs: BreadcrumbProps["breadcrumbs"];
  marginBottom: string;
};

const PageTitle: FC<PageTitleProps> = ({
  title,
  enableButton,
  buttonName,
  buttonLink,
  breadcrumbs,
  marginBottom,
}) => {
  const router = useRouter();
  const onClickHandler = useCallback(() => {
    if (enableButton && buttonLink) {
      router.push(buttonLink);
    }
  }, [router, buttonLink, enableButton]);
  return (
    <div className={cn("flex flex-col", marginBottom)}>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <div className="flex min-h-[44px] flex-row">
        <h2 className="instill-text-h2 mt-auto mr-auto text-black">{title}</h2>
        {enableButton ? (
          <PrimaryButton
            type="button"
            disabled={false}
            onClickHandler={onClickHandler}
          >
            {buttonName}
          </PrimaryButton>
        ) : null}
      </div>
    </div>
  );
};

export default PageTitle;

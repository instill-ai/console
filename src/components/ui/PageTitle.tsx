import { useCallback } from "react";
import { useRouter } from "next/router";
import cn from "clsx";

import Breadcrumb, { BreadcrumbProps } from "./Breadcrumb";
import { SolidButton } from "@instill-ai/design-system";

export type PageTitleProps = {
  title: string;
  enableButton: boolean;
  buttonName?: string;
  buttonLink?: string;
  breadcrumbs: BreadcrumbProps["breadcrumbs"];
  marginBottom: string;
};

const PageTitle = ({
  title,
  enableButton,
  buttonName,
  buttonLink,
  breadcrumbs,
  marginBottom,
}: PageTitleProps) => {
  const router = useRouter();
  const onClickHandler = useCallback(() => {
    if (enableButton && buttonLink) {
      router.push(buttonLink);
    }
  }, [router, buttonLink, enableButton]);
  return (
    <div className={cn("flex w-full flex-col", marginBottom)}>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <div className="flex min-h-[44px] w-full flex-row">
        <h2 className="text-instill-h2 mt-auto mr-auto text-black">{title}</h2>
        {enableButton ? (
          <SolidButton
            type="button"
            color="primary"
            disabled={false}
            onClickHandler={onClickHandler}
            position={null}
          >
            {buttonName}
          </SolidButton>
        ) : null}
      </div>
    </div>
  );
};

export default PageTitle;

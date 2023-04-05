import cn from "clsx";
import { useCallback } from "react";
import { useRouter } from "next/router";

import { BreadcrumbProps, Breadcrumb } from "./Breadcrumb";
import { SolidButton } from "@instill-ai/design-system";

export type PageTitleProps = {
  title: string;
  enableButton: boolean;
  buttonName?: string;
  buttonLink?: string;
  breadcrumbs: BreadcrumbProps["breadcrumbs"];
  marginBottom: string;
};

export const PageTitle = ({
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
        <h2 className="mt-auto mr-auto text-black text-instill-h2">{title}</h2>
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

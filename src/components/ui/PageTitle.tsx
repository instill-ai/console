import { useCallback } from "react";
import { useRouter } from "next/router";
import cn from "clsx";

import { BreadcrumbProps, Breadcrumb } from "./Breadcrumb";
import { SolidButton } from "@instill-ai/design-system";
import { useCreateUpdateDeleteResourceGuard } from "@/hooks";

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

  const enableGuard = useCreateUpdateDeleteResourceGuard();

  return (
    <div className={cn("flex w-full flex-col", marginBottom)}>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <div className="flex min-h-[44px] w-full flex-row">
        <h2 className="text-instill-h2 mt-auto mr-auto text-black">{title}</h2>
        {enableButton ? (
          <SolidButton
            type="button"
            color="primary"
            disabled={enableGuard}
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

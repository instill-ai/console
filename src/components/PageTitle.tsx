import cn from "clsx";
import { useCallback } from "react";
import { useRouter } from "next/router";

import { BreadcrumbProps, Breadcrumb } from "./Breadcrumb";
import { SolidButton } from "@instill-ai/design-system";

export type PageTitleProps = {
  title: string;
  disabledButton: boolean;
  buttonName?: string;
  buttonLink?: string;
  breadcrumbs: BreadcrumbProps["breadcrumbs"];
  marginBottom: string;
  onClick?: () => void;
};

export const PageTitle = ({
  title,
  disabledButton,
  buttonName,
  buttonLink,
  breadcrumbs,
  marginBottom,
  onClick,
}: PageTitleProps) => {
  const router = useRouter();
  const onClickHandler = useCallback(() => {
    if (!disabledButton && buttonLink) {
      if (onClick) {
        onClick();
      } else {
        router.push(buttonLink);
      }
    }
  }, [router, buttonLink, disabledButton, onClick]);
  return (
    <div className={cn("flex w-full flex-col", marginBottom)}>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <div className="flex min-h-[44px] w-full flex-row">
        <h2 className="mr-auto mt-auto text-black text-instill-h2">{title}</h2>
        {disabledButton ? null : (
          <SolidButton
            type="button"
            color="primary"
            disabled={false}
            onClickHandler={onClickHandler}
            position={null}
          >
            {buttonName}
          </SolidButton>
        )}
      </div>
    </div>
  );
};

import cn from "clsx";
import { useCallback } from "react";
import { useRouter } from "next/router";

import { BreadcrumbProps, Breadcrumb } from "./Breadcrumb";
import { SolidButton } from "@instill-ai/design-system";
import { Nullable } from "@/types/general";
import { useCreateUpdateDeleteResourceGuard } from "@/hooks";

export type PageTitleProps = {
  title: Nullable<string>;
  displayButton: boolean;
  buttonName?: string;
  buttonLink?: string;
  breadcrumbs: BreadcrumbProps["breadcrumbs"];
  marginBottom: string;
};

export const PageTitle = ({
  title,
  displayButton,
  buttonName,
  buttonLink,
  breadcrumbs,
  marginBottom,
}: PageTitleProps) => {
  const router = useRouter();
  const onClickHandler = useCallback(() => {
    if (displayButton && buttonLink) {
      router.push(buttonLink);
    }
  }, [router, buttonLink, displayButton]);

  const enableGuard = useCreateUpdateDeleteResourceGuard();

  return (
    <div className={cn("flex w-full flex-col", marginBottom)}>
      <div className="flex w-full flex-row">
        <div className="my-auto mr-auto flex flex-col gap-y-2">
          <Breadcrumb breadcrumbs={breadcrumbs} />
          {title ? (
            <h2 className="text-black text-instill-h2">{title}</h2>
          ) : null}
        </div>
        {displayButton ? (
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

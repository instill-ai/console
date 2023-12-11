import cn from "clsx";
import { Separator } from "@instill-ai/design-system";

export const SettingTabRoot = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex w-full flex-col pl-8">{children}</div>;
};

export const SettingTabHeader = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="mb-6 flex w-full flex-row justify-between border-b border-semantic-bg-line pb-5">
      <div className="flex flex-col">
        <h2 className="text-semantic-fg-primary product-body-text-1-semibold">
          {title}
        </h2>
        <p className="text-semantic-fg-secondary product-body-text-3-regular">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
};

export const SettingTabSectionRoot = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex flex-row gap-x-8">{children}</div>;
};

export const SettingTabSectionHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex w-[280px] flex-col">
      <h3 className="text-semantic-fg-primary product-body-text-3-semibold">
        {title}
      </h3>
      <p className="text-semantic-fg-secondary product-body-text-3-regular">
        {description}
      </p>
    </div>
  );
};

export const SettingTabSectionContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-[512px] flex-col", className)}>{children}</div>
  );
};

export const SettingTabSectionSeparator = () => {
  return <Separator orientation="horizontal" className="my-5 w-full" />;
};

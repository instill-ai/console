import { Separator } from "@instill-ai/design-system";

export const ProfileSeparator = ({ title }: { title: string }) => {
  return (
    <div className="relative w-full">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-semantic-bg-base-bg px-2">
        <p className="text-semantic-fg-primary product-body-text-3-medium">
          {title}
        </p>
      </div>
      <Separator orientation="horizontal" />
    </div>
  );
};

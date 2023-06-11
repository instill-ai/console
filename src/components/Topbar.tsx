import { Logo, Icons } from "@instill-ai/design-system";
import Link from "next/link";

export const Topbar = () => {
  return (
    <div className="flex h-[var(--topbar-height)] flex-row bg-semantic-bg-secondary-alt-primary">
      <div className="my-auto pl-4">
        <Logo type="ColourLogomarkWhiteType" width={180} />
      </div>
      <div className="flex flex-1 flex-row px-8 py-3">
        <Link className="ml-auto flex h-[48px] w-[48px]" href="/settings">
          <Icons.Gear01 className="m-auto h-6 w-6 stroke-semantic-fg-primary-on-bg-secondary" />
        </Link>
      </div>
    </div>
  );
};

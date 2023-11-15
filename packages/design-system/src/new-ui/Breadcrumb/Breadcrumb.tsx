import { Icons } from "../Icons";
export type BreadcrumbItem = {
  label: string;
  link?: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const activeLink = items.filter((item, index) => index != items.length - 1);
  return (
    <div className="text-muted-foreground mb-4 flex items-center gap-x-2 text-sm">
      {activeLink.map((item) => (
        <div className="flex gap-x-1">
          <div className="my-auto text-semantic-accent-default product-body-text-4-regular">
            <a href={item.link}>{item.label}</a>
          </div>
          <Icons.ChevronRight className="my-auto h-4 w-4 stroke-semantic-fg-disabled" />
        </div>
      ))}
      <div className="my-auto text-semantic-fg-disabled product-body-text-4-regular">
        {items[items.length - 1].label}
      </div>
    </div>
  );
};

export { Breadcrumb };

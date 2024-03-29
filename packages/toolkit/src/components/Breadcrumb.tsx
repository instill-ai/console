"use client";

export const Breadcrumb = ({ breadcrumbs }: { breadcrumbs: string[] }) => {
  return (
    <div className="flex flex-row">
      {breadcrumbs.map((e, index) => {
        if (breadcrumbs.length === 1) {
          return (
            <span
              key={e}
              className="text-semantic-fg-primary product-body-text-3-semibold"
            >
              {`${e}`}
            </span>
          );
        }

        if (index === breadcrumbs.length - 1) {
          return (
            <span
              key={e}
              className="text-semantic-fg-primary product-body-text-3-semibold"
            >
              &nbsp;{`${e}`}
            </span>
          );
        }
        return (
          <span
            key={e}
            className="text-semantic-fg-disabled product-body-text-3-medium"
          >
            {`${e}`}&nbsp;/
          </span>
        );
      })}
    </div>
  );
};

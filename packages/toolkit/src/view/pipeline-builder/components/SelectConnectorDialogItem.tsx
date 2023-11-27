import { Icons } from "@instill-ai/design-system";

export const SelectConnectorDialogItem = (
  props: {
    children: React.ReactNode;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { children, onClick, ...passThrough } = props;
  return (
    <button
      className="flex w-[228px] cursor-pointer flex-row space-x-2 rounded border border-semantic-bg-line p-2 hover:bg-semantic-accent-bg"
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
      }}
      {...passThrough}
    >
      <div className="my-auto flex flex-1 flex-row space-x-2">{children}</div>
      <div className="my-auto flex h-8 w-8 items-center justify-center">
        <Icons.Plus className="h-4 w-4 stroke-semantic-fg-secondary" />
      </div>
    </button>
  );
};

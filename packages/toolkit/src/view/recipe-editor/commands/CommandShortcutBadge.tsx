export const CommandShortcutBadge = ({ shortcut }: { shortcut: string }) => {
  return (
    <div className="bg-semantic-bg-alt-primary px-1 py-0.5 border border-semantic-bg-line rounded product-body-text-3-regular text-semantic-fg-secondary">
      {shortcut}
    </div>
  );
};

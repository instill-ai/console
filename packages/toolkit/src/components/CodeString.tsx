export const CodeString = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="rounded border border-semantic-bg-line bg-semantic-bg-primary px-1 py-0.5 font-mono font-normal text-semantic-fg-secondary">
      {children}
    </span>
  );
};

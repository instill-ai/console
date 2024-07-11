export const HeadExternalLink = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-row items-center gap-x-1 border-b border-zinc-700 text-sm font-semibold text-semantic-bg-secondary-alt-primary"
    >
      {children}
    </a>
  );
};

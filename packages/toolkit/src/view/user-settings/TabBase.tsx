export type TabBaseProps = {
  children: React.ReactNode;
  title: string;
  description: string;
};

export const TabBase = (props: TabBaseProps) => {
  const { children, title, description } = props;
  return (
    <div className="flex">
      <div className="flex flex-col">
        <div className="mb-6 flex flex-col">
          <p className="text-lg font-semibold leading-7 text-[#101828]">
            {title}
          </p>
          <p className="mb-5 text-sm font-normal leading-5 text-[#475467]">
            {description}
          </p>
          <div className="border-b border-b-[#EAECF0]" />
        </div>
        {children}
      </div>
    </div>
  );
};

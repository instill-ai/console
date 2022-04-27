import { FC } from "react";

export type PageTitleProps = {
  title: string;
};

const PageTitle: FC<PageTitleProps> = ({ title }) => {
  return <h2 className="instill-text-h2 text-black">{title}</h2>;
};

export default PageTitle;

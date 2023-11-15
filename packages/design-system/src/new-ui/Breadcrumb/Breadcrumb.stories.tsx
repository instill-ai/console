import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/NewUi/Breadcrumb",
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Primary = () => {
  const items: BreadcrumbItem[] = [
    { label: "Home", link: "/home" },
    { label: "Organizations", link: "/organization" },
    { label: "Data" },
  ];
  return <Breadcrumb items={items} />;
};

export const SinglePage = () => {
  const singleItem: BreadcrumbItem[] = [{ label: "Home" }];
  return <Breadcrumb items={singleItem} />;
};

export const TwoPage = () => {
  const twoItems: BreadcrumbItem[] = [
    { label: "Organizations", link: "/organization" },
    { label: "Data" },
  ];
  return <Breadcrumb items={twoItems} />;
};

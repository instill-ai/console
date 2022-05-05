import { ComponentStory, ComponentMeta } from "@storybook/react";
import StatusOverview from "../StatusOverview";
import NameCell from "../TableCells/NameCell";
import Table, { TableProps } from "./Table";

export default {
  title: "Components/Ui/Table",
  component: Table,
} as ComponentMeta<typeof Table>;

const rows: TableProps["rows"] = [
  {
    rowKey: "1",
    items: [
      {
        key: "1-1",
        item: (
          <NameCell width="w-[269px]" status="on" updatedAt="" name="Yolov4" />
        ),
      },
    ],
  },
];

const head = [
  {
    key: "head-1",
    item: <StatusOverview errorCounts={3} offCounts={5} onCounts={10} />,
  },
];

const Template: ComponentStory<typeof Table> = (args) => (
  <Table {...args} rows={rows} headItems={head} />
);

export const Playground: ComponentStory<typeof Table> = Template.bind({});

Playground.args = {};

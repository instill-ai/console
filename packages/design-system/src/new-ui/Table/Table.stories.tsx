import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./Table";
import { Tag } from "../Tag";

const meta: Meta<typeof Table> = {
  title: "Components/NewUi/Table",
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Regular: Story = {
  render: () => (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-auto text-left">Pipeline ID</Table.Head>
          <Table.Head className="w-[100px] text-center">Status</Table.Head>
          <Table.Head className="w-[200px] text-center">
            Completed Triggers
          </Table.Head>
          <Table.Head className="w-[150px] text-center">
            Errored Triggers
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Pipeline-name-1</Table.Cell>
          <Table.Cell>
            <Tag variant="lightRed" className="border-0" size="sm">
              Deleted
            </Tag>
          </Table.Cell>
          <Table.Cell className="text-center">250</Table.Cell>
          <Table.Cell className="text-center">250</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Pipeline-name-1</Table.Cell>
          <Table.Cell>
            <Tag variant="lightGreen" className="border-0" size="sm">
              Active
            </Tag>
          </Table.Cell>
          <Table.Cell className="text-center">250</Table.Cell>
          <Table.Cell className="text-center">250</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Foot className="text-left">foot-1</Table.Foot>
          <Table.Foot className="text-center">foot-2</Table.Foot>
          <Table.Foot className="text-center">foot-3</Table.Foot>
          <Table.Foot className="text-center">foot-4</Table.Foot>
        </Table.Row>
      </Table.Footer>
    </Table.Root>
  ),
};

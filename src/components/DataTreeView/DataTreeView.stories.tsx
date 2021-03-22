import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import DataTreeView from "./DataTreeView";
import { DataTreeViewProps, DataNodeDrop, Node } from "./DataTreeView.types";

export default {
  title: "Example/DataTreeView",
  component: DataTreeView,
} as Meta;

const treeData = [
  {
    id: "item-1",
    label: "Item 1",
  },
  {
    id: "item-2",
    label: "Item 2",
    children: [
      { id: "item-2-1", label: "Item 2.1" },
      {
        id: "item-2-2",
        label: "Item 2.2",
        children: [
          {
            id: "item-2-2-1",
            label: "Item 2.2.1",
            children: [{ id: "item-2-2-1-1", label: "Item 2.2.1.1" }],
          },
        ],
      },
    ],
  },
  {
    id: "item-3",
    label: "Item 3",
  },
  {
    id: "item-4",
    label: "Item 4",
  },
];

const Template: Story<DataTreeViewProps> = (args) => <DataTreeView {...args} />;

export const Basic = Template.bind({});

Basic.args = {
  draggable: true,
  defaultExpanded: ["item-2", "item-2-2", "item-2-2-1"],
  treeData,
};

const ControlledTemplate: Story<DataTreeViewProps> = (args) => {
  const [data, setData] = React.useState<Node[]>(treeData);

  const handleNodeDrop = ({ treeData }: DataNodeDrop) => {
    setData(treeData);
  };

  return <DataTreeView {...args} treeData={data} onNodeDrop={handleNodeDrop} />;
};

export const OnNodeDrop = ControlledTemplate.bind({});

OnNodeDrop.args = {
  draggable: true,
  defaultExpanded: ["item-2", "item-2-2", "item-2-2-1"],
};

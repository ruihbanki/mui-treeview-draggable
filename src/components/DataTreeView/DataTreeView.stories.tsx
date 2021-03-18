import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import DataTreeView from "./DataTreeView";
import { DataTreeViewProps } from "./DataTreeView.types";

export default {
  title: "Example/DataTreeView",
  component: DataTreeView,
} as Meta;

const Template: Story<DataTreeViewProps> = (args) => (
  <div style={{ paddingBottom: 1000 }}>
    <DataTreeView {...args} />
  </div>
);

export const Basic = Template.bind({});

Basic.args = {
  draggable: true,
  defaultExpanded: ["item-2", "item-2-2", "item-2-2-1"],
  onDrop: (params) => console.log(params),
  data: [
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
      label: "Item 2",
    },
    {
      id: "item-4",
      label: "Item 4",
    },
  ],
  getNodeId: (node) => node.id,
  getNodeLabel: (node) => node.label,
  getNodeChildren: (node) => node.children,
};

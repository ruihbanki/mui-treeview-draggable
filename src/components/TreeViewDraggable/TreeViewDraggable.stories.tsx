import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import TreeViewDraggable from "./TreeViewDraggable";
import TreeItemDraggable from "../TreeItemDraggable";
import TreeViewDraggableProps from "./TreeViewDraggableProps";

export default {
  title: "Example/TreeViewDraggable",
  component: TreeViewDraggable,
} as Meta;

const Template: Story<TreeViewDraggableProps> = (args) => (
  <div style={{ paddingBottom: 1000 }}>
    <TreeViewDraggable {...args}>
      <TreeItemDraggable nodeId="item-1" label="Item 1" />
      <TreeItemDraggable nodeId="item-2" label="Item 2">
        <TreeItemDraggable nodeId="item-2-1" label="Item 2.1" />
        <TreeItemDraggable nodeId="item-2-2" label="Item 2.2">
          <TreeItemDraggable nodeId="item-2-2-1" label="Item 2.2.1">
            <TreeItemDraggable nodeId="item-2-2-1-1" label="Item 2.2.1.1" />
          </TreeItemDraggable>
        </TreeItemDraggable>
      </TreeItemDraggable>
      <TreeItemDraggable nodeId="item-3" label="Item 3" />
    </TreeViewDraggable>
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  allowDragging: true,
  defaultExpanded: ["item-2", "item-2-2", "item-2-2-1"],
  onDrop: (params) => console.log(params),
};

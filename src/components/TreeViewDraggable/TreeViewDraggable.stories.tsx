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
  <TreeViewDraggable {...args}>
    <TreeItemDraggable nodeId="item-1" label="Item 1" />
    <TreeItemDraggable nodeId="item-2" label="Item 2">
      <TreeItemDraggable nodeId="item-2-1" label="Item 2.1" />
      <TreeItemDraggable nodeId="item-2-2" label="Item 2.2" />
      <TreeItemDraggable nodeId="item-3" label="Item 3" />
    </TreeItemDraggable>
  </TreeViewDraggable>
);

export const Basic = Template.bind({});
Basic.args = {};

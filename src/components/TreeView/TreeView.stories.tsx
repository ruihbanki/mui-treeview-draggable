import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import TreeView from "./TreeView";
import TreeItem from "../TreeItem";
import { TreeViewProps } from "./TreeView.types";

export default {
  title: "Example/TreeView",
  component: TreeView,
} as Meta;

const Template: Story<TreeViewProps> = (args) => (
  <div style={{ paddingBottom: 1000 }}>
    <TreeView {...args}>
      <TreeItem nodeId="item-1" label="Item 1" />
      <TreeItem nodeId="item-2" label="Item 2">
        <TreeItem nodeId="item-2-1" label="Item 2.1" />
        <TreeItem nodeId="item-2-2" label="Item 2.2">
          <TreeItem nodeId="item-2-2-1" label="Item 2.2.1">
            <TreeItem nodeId="item-2-2-1-1" label="Item 2.2.1.1" />
          </TreeItem>
        </TreeItem>
      </TreeItem>
      <TreeItem nodeId="item-3" label="Item 3" />
      <TreeItem nodeId="item-4" label="Item 4" />
    </TreeView>
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  draggable: true,
  defaultExpanded: ["item-2", "item-2-2", "item-2-2-1"],
  onDrop: (params) => console.log(params),
};

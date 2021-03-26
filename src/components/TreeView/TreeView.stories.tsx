import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import TreeView from "./TreeView";
import TreeItem from "../TreeItem";
import { TreeViewProps } from "./TreeView.types";

const treeViewDescription = `
This is a component that wraps the Material UI TreeView and add drag and drop capabilities to it.

## How it works
- Keep the mouse or touch pressed on some node and the component will activate the drag mode
- Drop in the desired location

## Accessibility
- Keep the spacebar pressed to activate the drag mode
- Use the Arrow Up/Down keys to find the desired location
- Press Enter to confirm or Esc to cancel
`;

export default {
  title: "Components/TreeView",
  component: TreeView,
  subcomponents: { TreeItem },
  parameters: {
    docs: {
      description: {
        component: treeViewDescription,
      },
    },
  },
} as Meta;

const Template: Story<TreeViewProps> = (args) => (
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
);

export const Basic = Template.bind({});

Basic.args = {
  draggable: true,
  defaultExpanded: ["item-2", "item-2-2", "item-2-2-1"],
};

import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import FolderOutlinedIcon from "@material-ui/icons/FolderOutlined";
import FolderOpenOutlinedIcon from "@material-ui/icons/FolderOpenOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import KeyboardArrowRightOutlinedIcon from "@material-ui/icons/KeyboardArrowRightOutlined";
import KeyboardArrowDownOutlinedIcon from "@material-ui/icons/KeyboardArrowDownOutlined";

import DataTreeView from "./DataTreeView";
import { DataTreeViewProps, DataNodeDrop, Node } from "./DataTreeView.types";

const dataTreeViewDescription = `
This is a wrap component of the TreeView that uses a node json structure to create a tree.
Its great advantage is to receive a changed treeData in the drop operation, making the implementation of drag and drop much easier.
`;

export default {
  title: "Components/DataTreeView",
  component: DataTreeView,
  parameters: {
    docs: {
      description: {
        component: dataTreeViewDescription,
      },
    },
  },
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

const filesData = [
  {
    id: "components",
    label: "components",
    type: "folder",
    children: [
      {
        id: "treeitem",
        label: "TreeItem",
        type: "folder",
        children: [
          {
            id: "treeitemcomponent",
            label: "TreeItem.tsx",
            type: "file",
          },
        ],
      },
      {
        id: "treeview",
        label: "TreeView",
        type: "folder",
        children: [
          {
            id: "treeviewcomponent",
            label: "TreeView.tsx",
            type: "file",
          },
        ],
      },
    ],
  },
  {
    id: "utils",
    label: "utils",
    type: "folder",
    children: [
      {
        id: "treeutils",
        label: "treeUtils.ts",
        type: "file",
      },
      {
        id: "htmlutils",
        label: "htmlUtils.ts",
        type: "file",
      },
    ],
  },
];

const Template: Story<DataTreeViewProps> = (args) => <DataTreeView {...args} />;

export const Basic = Template.bind({});

Basic.storyName = "Basic";

Basic.parameters = {
  docs: {
    description: {
      story: "Basic example using the treeData to render a tree.",
    },
  },
};

Basic.args = {
  draggable: true,
  defaultExpanded: ["item-2", "item-2-2", "item-2-2-1"],
  treeData,
};

const ControlledTemplate: Story<DataTreeViewProps> = (args) => {
  const [data, setData] = React.useState<Node[]>(args.treeData);
  const handleNodeDrop = ({ treeData }: DataNodeDrop) => {
    setData(treeData);
  };
  return <DataTreeView {...args} treeData={data} onNodeDrop={handleNodeDrop} />;
};

export const OnNodeDrop = ControlledTemplate.bind({});

OnNodeDrop.storyName = "OnNodeDrop";

OnNodeDrop.parameters = {
  docs: {
    description: {
      story:
        "Basic example using the treeData returned by the onNodeDrop prop to change the state of the component.",
    },
  },
};

OnNodeDrop.args = {
  draggable: true,
  defaultExpanded: ["item-2", "item-2-2", "item-2-2-1"],
  defaultCollapseIcon: <KeyboardArrowDownOutlinedIcon />,
  defaultExpandIcon: <KeyboardArrowRightOutlinedIcon />,
  treeData,
};

export const FileExplorer = ControlledTemplate.bind({});

FileExplorer.storyName = "File explorer";

FileExplorer.parameters = {
  docs: {
    description: {
      story:
        "Example of custom icons and the use of allowNodeDrop to create a file explorer tree. Note that files node can't have children.",
    },
  },
};

FileExplorer.args = {
  draggable: true,
  defaultExpanded: ["components", "hooks", "utils", "treeitem", "treeview"],
  treeData: filesData,
  renderEndIcon: ({ type }) =>
    type === "folder" ? (
      <FolderOpenOutlinedIcon color="primary" />
    ) : (
      <DescriptionOutlinedIcon color="primary" />
    ),
  renderExpandIcon: () => <FolderOutlinedIcon color="primary" />,
  renderCollapseIcon: () => <FolderOpenOutlinedIcon color="primary" />,
  allowNodeDrop: ({ toNode, position }) => {
    if (toNode.type === "file" && position === "inside") {
      return false;
    }
    return true;
  },
};

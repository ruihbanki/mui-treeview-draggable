import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import FolderOutlinedIcon from "@material-ui/icons/FolderOutlined";
import FolderOpenOutlinedIcon from "@material-ui/icons/FolderOpenOutlined";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import KeyboardArrowRightOutlinedIcon from "@material-ui/icons/KeyboardArrowRightOutlined";
import KeyboardArrowDownOutlinedIcon from "@material-ui/icons/KeyboardArrowDownOutlined";

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

OnNodeDrop.args = {
  draggable: true,
  defaultExpanded: ["item-2", "item-2-2", "item-2-2-1"],
  defaultCollapseIcon: <KeyboardArrowRightOutlinedIcon />,
  defaultExpandIcon: <KeyboardArrowDownOutlinedIcon />,
  treeData,
};

export const FileExplorer = ControlledTemplate.bind({});

FileExplorer.args = {
  draggable: true,
  defaultExpanded: ["components", "hooks", "utils", "treeitem", "treeview"],
  treeData: filesData,
  renderEndIcon: () => <InsertDriveFileOutlinedIcon color="primary" />,
  renderExpandIcon: () => <FolderOutlinedIcon color="primary" />,
  renderCollapseIcon: () => <FolderOpenOutlinedIcon color="primary" />,
};

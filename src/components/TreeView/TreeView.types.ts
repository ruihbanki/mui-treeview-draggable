import { TreeViewProps as MuiTreeViewProps } from "@material-ui/lab/TreeView/TreeView.d";

export type Position = "before" | "after" | "inside";

export type NodeDrop = {
  fromNodeId?: string;
  toNodeId?: string;
  position?: Position;
};

type TreeViewPropsBase = {
  draggable?: boolean;
  onNodeDrop?: (nodeDrop: NodeDrop) => void;
  allowNodeDrop?: (nodeDrop: NodeDrop) => boolean;
};

export type TreeViewContext = TreeViewPropsBase;

export type TreeViewProps = MuiTreeViewProps & TreeViewPropsBase;

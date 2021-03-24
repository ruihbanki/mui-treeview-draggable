import { TreeViewProps as MuiTreeViewProps } from "@material-ui/lab/TreeView/TreeView.d";

export type Position = "before" | "after" | "inside";

export type NodeDrop = {
  fromNodeId?: string;
  toNodeId?: string;
  position?: Position;
};

type TreeViewPropsBase = {
  /** enable the drag operation. Long mouse press, long touch press or long spacebar press. */
  draggable?: boolean;
  /** Called after the drop operation. */
  onNodeDrop?: (nodeDrop: NodeDrop) => void;
  /** Whether to allow dropping on the node. */
  allowNodeDrop?: (nodeDrop: NodeDrop) => boolean;
};

export type TreeViewContext = TreeViewPropsBase;

export type TreeViewProps = MuiTreeViewProps & TreeViewPropsBase;

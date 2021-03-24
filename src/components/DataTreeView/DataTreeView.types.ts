import { TreeViewProps, Position } from "../TreeView/TreeView.types";

export interface Node {
  id: string;
  label: string;
  children?: Node[];
  /* eslint-disable */
  [key: string]: any;
}

export type DataNodeDrop = {
  fromNode?: Node;
  toNode?: Node;
  position?: Position;
  treeData?: Node[];
};

type DataTreeViewPropsBase = {
  /** Nested node structure array. */
  treeData: Node[];
  /** Function to return the node's label. */
  renderLabel?: (node: Node) => JSX.Element;
  /** Function to return the node's icon. */
  renderIcon?: (node: Node) => JSX.Element;
  /** Function to return the node's collapse icon. */
  renderCollapseIcon?: (node: Node) => JSX.Element;
  /** Function to return the node's expand icon. */
  renderExpandIcon?: (node: Node) => JSX.Element;
  /** Function to return the node's end icon. */
  renderEndIcon?: (node: Node) => JSX.Element;
  /** Called after the drop operation. */
  onNodeDrop?: (dataNodeDrop: DataNodeDrop) => void;
  /** Whether to allow dropping on the node. */
  allowNodeDrop?: (dataNodeDrop: DataNodeDrop) => boolean;
};

export type DataTreeViewProps = DataTreeViewPropsBase &
  Omit<TreeViewProps, "onNodeDrop" | "allowNodeDrop">;

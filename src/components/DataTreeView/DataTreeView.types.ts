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
  treeData: Node[];
  renderLabel?: (node: Node) => JSX.Element;
  renderIcon?: (node: Node) => JSX.Element;
  renderCollapseIcon?: (node: Node) => JSX.Element;
  renderExpandIcon?: (node: Node) => JSX.Element;
  renderEndIcon?: (node: Node) => JSX.Element;
  onNodeDrop?: (dataNodeDrop: DataNodeDrop) => void;
  allowNodeDrop?: (dataNodeDrop: DataNodeDrop) => boolean;
};

export type DataTreeViewProps = DataTreeViewPropsBase & TreeViewProps;

import { NodeDrop, TreeViewProps } from "../TreeView/TreeView.types";

export interface Node {
  id: string;
  label: string;
  children?: Node[];
}

export type DataNodeDrop = NodeDrop & {
  treeData?: Node[];
};

type DataTreeViewPropsBase = {
  treeData: Node[];
  renderLabel: (node: Node) => JSX.Element;
  onNodeDrop?: (dataNodeDrop: DataNodeDrop) => void;
  allowNodeDrop: (nodeDrop: NodeDrop) => boolean;
};

export type DataTreeViewProps = DataTreeViewPropsBase & TreeViewProps;

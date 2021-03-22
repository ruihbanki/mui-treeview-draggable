import { Position, TreeViewProps } from "../TreeView/TreeView.types";

export interface Node {
  id: string;
  label: string;
  children?: Node[];
}

type DataTreeViewPropsBase = {
  treeData: Node[];
  renderLabel: (node: Node) => JSX.Element;
  onNodeDrop?: ({
    fromNodeId,
    toNodeId,
    position,
    treeData,
  }: {
    fromNodeId: string;
    toNodeId: string;
    position: Position;
    treeData: Node[];
  }) => void;
  allowNodeDrop: ({
    fromNode,
    toNode,
    position,
  }: {
    fromNode: Node;
    toNode: Node;
    position: Position;
  }) => boolean;
};

export type DataTreeViewProps = DataTreeViewPropsBase & TreeViewProps;

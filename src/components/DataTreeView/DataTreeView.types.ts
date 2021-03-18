import { TreeViewProps } from "../TreeView/TreeView.types";

export interface Node {
  id: string;
  label: string;
  children?: Node[];
}

type DataTreeViewPropsBase = {
  treeData: Node[];
  renderLabel: (node: Node) => JSX.Element;
};

export type DataTreeViewProps = DataTreeViewPropsBase & TreeViewProps;

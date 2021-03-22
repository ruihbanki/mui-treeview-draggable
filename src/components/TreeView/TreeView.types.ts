import { TreeViewProps as MuiTreeViewProps } from "@material-ui/lab/TreeView/TreeView.d";

export type Position = "before" | "after" | "inside";

type TreeViewPropsBase = {
  draggable?: boolean;
  onNodeDrop?: ({
    fromNodeId,
    toNodeId,
    position,
  }: {
    fromNodeId: string;
    toNodeId: string;
    position: Position;
  }) => void;
  allowNodeDrop?: ({
    fromNodeId,
    toNodeId,
    position,
  }: {
    fromNodeId: string;
    toNodeId: string;
    position: Position;
  }) => boolean;
};

export type TreeViewContext = TreeViewPropsBase;

export type TreeViewProps = MuiTreeViewProps & TreeViewPropsBase;

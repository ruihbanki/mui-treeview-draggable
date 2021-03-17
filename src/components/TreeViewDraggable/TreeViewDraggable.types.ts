import { TreeViewProps as MuiTreeViewProps } from "@material-ui/lab/TreeView/TreeView.d";

export type Position = "before" | "after" | "inside";

type TreeViewDraggablePropsBase = {
  draggable?: boolean;
  onDrop?: ({
    fromNodeId,
    toNodeId,
    position,
  }: {
    fromNodeId: string;
    toNodeId: string;
    position: Position;
  }) => void;
  allowDrop?: ({
    fromNodeId,
    toNodeId,
    position,
  }: {
    fromNodeId: string;
    toNodeId: string;
    position: Position;
  }) => boolean;
};

export type TreeViewDraggableProps = MuiTreeViewProps &
  TreeViewDraggablePropsBase;

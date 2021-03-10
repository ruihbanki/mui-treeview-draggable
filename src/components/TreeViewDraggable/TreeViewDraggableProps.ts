import { TreeViewProps as MuiTreeViewProps } from "@material-ui/lab/TreeView/TreeView.d";

type Position = "before" | "after" | "inside";

type TreeViewDraggablePropsBase = {
  allowDragging?: boolean;
  onDrop?: ({fromNodeId, toNodeId, position} : { fromNodeId: string, toNodeId:string, position: Position }) => void
};

type TreeViewDraggableProps = MuiTreeViewProps & TreeViewDraggablePropsBase;

export default TreeViewDraggableProps;

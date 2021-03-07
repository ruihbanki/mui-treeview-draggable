import { TreeViewProps as MuiTreeViewProps } from "@material-ui/lab/TreeView/TreeView.d";

type TreeViewDraggablePropsBase = {
  allowDragging?: boolean;
};

type TreeViewDraggableProps = MuiTreeViewProps & TreeViewDraggablePropsBase;

export default TreeViewDraggableProps;

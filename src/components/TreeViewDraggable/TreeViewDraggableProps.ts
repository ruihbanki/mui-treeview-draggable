import { TreeViewProps as MuiTreeViewProps } from "@material-ui/lab/TreeView/TreeView.d";

interface TreeViewDraggablePropsBase {
  draggable?: boolean;
}

type TreeViewDraggableProps = MuiTreeViewProps | TreeViewDraggablePropsBase;

export default TreeViewDraggableProps;

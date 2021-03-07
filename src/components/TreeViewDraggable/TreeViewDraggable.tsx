import React from "react";
import TreeView from "@material-ui/lab/TreeView";

import TreeViewDraggableProps from "./TreeViewDraggableProps";

function TreeViewDraggable(props: TreeViewDraggableProps): JSX.Element {
  const { children, ...other } = props;

  return <TreeView {...other}>{children}</TreeView>;
}

export default TreeViewDraggable;

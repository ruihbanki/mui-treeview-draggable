import React from "react";
import TreeItem from "@material-ui/lab/TreeItem";
import { TreeItemProps } from "@material-ui/lab/TreeItem/TreeItem.d";

function TreeItemDraggable(props: TreeItemProps): JSX.Element {
  const { children, ...other } = props;

  return <TreeItem {...other}>{children}</TreeItem>;
}

export default TreeItemDraggable;

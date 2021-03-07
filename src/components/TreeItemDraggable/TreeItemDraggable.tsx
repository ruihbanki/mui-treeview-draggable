import React from "react";
import TreeItem from "@material-ui/lab/TreeItem";

import { TreeItemProps } from "@material-ui/lab/TreeItem/TreeItem.d";
import TreeViewDraggableContext from "../TreeViewDraggable/TreeViewDraggableContext";
import useStyles from "./TreeItemDraggable.styles";

const LONG_PRESS = 500;

function TreeItemDraggable(props: TreeItemProps): JSX.Element {
  const { children, onMouseDown, ...other } = props;

  const classes = useStyles();

  const { allowDragging } = React.useContext(TreeViewDraggableContext);

  const [dragging, setDragging] = React.useState(false);

  const handleMouseDown = (event) => {
    if (allowDragging) {
      setTimeout(() => {
        setDragging(true);
      }, LONG_PRESS);
    }

    if (onMouseDown) {
      onMouseDown(event);
    }
  };

  return (
    <TreeItem
      {...other}
      classes={classes}
      data-dragging={dragging}
      onMouseDown={handleMouseDown}
    >
      {children}
    </TreeItem>
  );
}

export default TreeItemDraggable;

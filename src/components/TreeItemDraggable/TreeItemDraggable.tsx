import React from "react";
import TreeItem from "@material-ui/lab/TreeItem";

import { TreeItemProps } from "@material-ui/lab/TreeItem/TreeItem.d";
import TreeViewDraggableContext from "../TreeViewDraggable/TreeViewDraggableContext";
import useStyles from "./TreeItemDraggable.styles";
import useDragging from "../../hooks/useDragging";

function TreeItemDraggable(props: TreeItemProps): JSX.Element {
  const {
    children,
    nodeId,
    onMouseDown,
    onTouchStart,
    onKeyDown,
    ...other
  } = props;

  const classes = useStyles();

  const { allowDragging } = React.useContext(TreeViewDraggableContext);

  const handleDragStart = React.useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      console.log("start", event.target);
    },
    []
  );

  const handleDragMove = React.useCallback((event: MouseEvent | TouchEvent) => {
    console.log("move", event.target);
  }, []);

  const handleDragKey = React.useCallback((event: KeyboardEvent) => {
    console.log("key", event.target);
  }, []);

  const handleDragEnd = React.useCallback((event: MouseEvent | TouchEvent) => {
    console.log("end", event.target);
  }, []);

  const { handleMouseDown, handleTouchStart, handleKeyDown } = useDragging({
    active: allowDragging,
    onStart: handleDragStart,
    onMove: handleDragMove,
    onKey: handleDragKey,
    onEnd: handleDragEnd,
    onMouseDown,
    onTouchStart,
    onKeyDown,
  });

  return (
    <TreeItem
      {...other}
      classes={classes}
      id={nodeId}
      data-nodeid={nodeId}
      nodeId={nodeId}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onKeyDown={handleKeyDown}
    >
      {children}
    </TreeItem>
  );
}

export default TreeItemDraggable;

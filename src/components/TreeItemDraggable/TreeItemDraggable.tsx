import React, { MouseEvent } from "react";
import TreeItem from "@material-ui/lab/TreeItem";

import { TreeItemProps } from "@material-ui/lab/TreeItem/TreeItem.d";
import TreeViewDraggableContext from "../TreeViewDraggable/TreeViewDraggableContext";
import useStyles from "./TreeItemDraggable.styles";

const LONG_PRESS = 500;

function TreeItemDraggable(props: TreeItemProps): JSX.Element {
  const {
    children,
    nodeId,
    onMouseDown,
    onLabelClick,
    onTouchStart,
    ...other
  } = props;

  const classes = useStyles();

  const {
    allowDragging,
    startDragging,
    stopDragging,
    fromNodeId,
  } = React.useContext(TreeViewDraggableContext);

  const timeoutRef = React.useRef<NodeJS.Timeout>(null);

  const dragging = nodeId === fromNodeId;

  const mouseMoveListener = React.useCallback(() => {
    clearTimeout(timeoutRef.current);
  }, []);

  const mouseUpListener = React.useCallback(() => {
    clearTimeout(timeoutRef.current);
    document.removeEventListener("mouseup", mouseUpListener);
    document.removeEventListener("mousemove", mouseMoveListener);
  }, [mouseMoveListener]);

  const clickListener = React.useCallback(() => {
    document.removeEventListener("click", clickListener);
    stopDragging();
  }, [stopDragging]);

  const handleMouseDown = React.useCallback(
    (event) => {
      if (allowDragging) {
        event.stopPropagation();
        document.addEventListener("mouseup", mouseUpListener);
        document.addEventListener("mousemove", mouseMoveListener);
        const target = event.currentTarget as HTMLElement;
        timeoutRef.current = setTimeout(() => {
          document.addEventListener("click", clickListener);
          startDragging(target, nodeId);
        }, LONG_PRESS);
      }

      if (onMouseDown) {
        onMouseDown(event);
      }
    },
    [
      allowDragging,
      clickListener,
      mouseMoveListener,
      mouseUpListener,
      nodeId,
      onMouseDown,
      startDragging,
    ]
  );

  const handleLabelClick = React.useCallback(
    (event) => {
      if (dragging) {
        console.log("handleLabelClick");
        event.stopPropagation();
        document.removeEventListener("click", clickListener);
        stopDragging();
      }

      if (onLabelClick) {
        onLabelClick(event);
      }
    },
    [clickListener, dragging, onLabelClick, stopDragging]
  );

  const touchMoveListener = React.useCallback(() => {
    clearTimeout(timeoutRef.current);
  }, []);

  const touchEndListener = React.useCallback(() => {
    clearTimeout(timeoutRef.current);
    stopDragging();
    document.removeEventListener("touchend", touchEndListener);
    document.removeEventListener("touchmove", touchMoveListener);
  }, [stopDragging, touchMoveListener]);

  const handleTouchStart = React.useCallback(
    (event) => {
      if (allowDragging) {
        event.stopPropagation();
        document.addEventListener("touchend", touchEndListener);
        document.addEventListener("touchmove", touchMoveListener);
        const target = event.currentTarget as HTMLElement;
        timeoutRef.current = setTimeout(() => {
          startDragging(target, nodeId);
        }, LONG_PRESS);
      }

      if (onTouchStart) {
        onTouchStart(event);
      }
    },
    [
      allowDragging,
      nodeId,
      onTouchStart,
      startDragging,
      touchEndListener,
      touchMoveListener,
    ]
  );

  return (
    <TreeItem
      {...other}
      classes={classes}
      data-dragging={dragging}
      nodeId={nodeId}
      onMouseDown={handleMouseDown}
      onLabelClick={handleLabelClick}
      onTouchStart={handleTouchStart}
    >
      {children}
    </TreeItem>
  );
}

export default TreeItemDraggable;

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

  const fromLiRef = React.useRef(null);

  const toLiRef = React.useRef(null);

  const positionRef = React.useRef(null);

  const pointerMoveListener = React.useCallback((event) => {
    clearTimeout(timeoutRef.current);
    const clientX = event.clientX;
    const clientY = event.clientY;

    const target = document
      .elementFromPoint(clientX, clientY)
      .closest(".MuiTreeItem-root");
    if (toLiRef.current) {
      toLiRef.current.classList.remove("drop", positionRef.current);
    }
    toLiRef.current = target;

    if (!target) {
      return;
    }

    const targetNodeId = target.getAttribute("data-nodeid");

    const expanded = Array.from(target.children).some((elem) =>
      elem.classList.contains("MuiTreeItem-group")
    );

    const position = getDropPosition(target, clientX, clientY);
    positionRef.current = position;

    if (
      !fromLiRef.current.contains(target) &&
      !(expanded && position === "after")
    ) {
      toLiRef.current.classList.add("drop", positionRef.current);
      console.log(targetNodeId, position);
    }
  }, []);

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
    document.removeEventListener("pointermove", pointerMoveListener);
    stopDragging();
    if (toLiRef.current) {
      toLiRef.current.classList.remove("drop", positionRef.current);
    }
    fromLiRef.current = null;
    toLiRef.current = null;
  }, [stopDragging, pointerMoveListener]);

  const handleMouseDown = React.useCallback(
    (event) => {
      if (allowDragging) {
        event.stopPropagation();
        document.addEventListener("mouseup", mouseUpListener);
        document.addEventListener("mousemove", mouseMoveListener);
        const target = event.currentTarget as HTMLElement;
        timeoutRef.current = setTimeout(() => {
          document.addEventListener("click", clickListener);
          document.addEventListener("pointermove", pointerMoveListener);
          startDragging(target, nodeId);
          fromLiRef.current = target.closest(".MuiTreeItem-root");
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
      pointerMoveListener,
    ]
  );

  const handleLabelClick = React.useCallback(
    (event) => {
      if (dragging) {
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
    document.removeEventListener("pointermove", pointerMoveListener);
    if (toLiRef.current) {
      toLiRef.current.classList.remove("drop", positionRef.current);
    }
    fromLiRef.current = null;
    toLiRef.current = null;
  }, [stopDragging, touchMoveListener, pointerMoveListener]);

  const handleTouchStart = React.useCallback(
    (event) => {
      if (allowDragging) {
        event.stopPropagation();
        document.addEventListener("touchend", touchEndListener);
        document.addEventListener("touchmove", touchMoveListener);
        const target = event.currentTarget as HTMLElement;
        timeoutRef.current = setTimeout(() => {
          startDragging(target, nodeId);
          document.addEventListener("pointermove", pointerMoveListener);
          fromLiRef.current = target.closest(".MuiTreeItem-root");
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
      pointerMoveListener,
    ]
  );

  return (
    <TreeItem
      {...other}
      classes={classes}
      data-dragging={dragging}
      data-nodeid={nodeId}
      nodeId={nodeId}
      onMouseDown={handleMouseDown}
      onLabelClick={handleLabelClick}
      onTouchStart={handleTouchStart}
    >
      {children}
    </TreeItem>
  );
}

function getDropPosition(target, clientX, clientY) {
  const targetRect = target.getBoundingClientRect();

  const middleY = targetRect.top + targetRect.height / 2;

  if (clientY < middleY) {
    return "before";
  }

  if (clientX > targetRect.left + 60) {
    return "inside";
  }

  return "after";
}

export default TreeItemDraggable;

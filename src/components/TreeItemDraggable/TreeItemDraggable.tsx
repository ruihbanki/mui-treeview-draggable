import React from "react";
import TreeItem from "@material-ui/lab/TreeItem";

import { TreeItemProps } from "@material-ui/lab/TreeItem/TreeItem.d";
import TreeViewDraggableContext from "../TreeViewDraggable/TreeViewDraggableContext";
import useStyles from "./TreeItemDraggable.styles";
import useDragging from "../../hooks/useDragging";
import useScrollOnMove from "../../hooks/useScrollOnMove";
import { getScrollContaneir, getClientPosition } from "../../utils/htmlUtils";
import { getDropPosition } from "./TreeItemDraggable.helper";

type Position = "before" | "after" | "inside";

function TreeItemDraggable(props: TreeItemProps): JSX.Element {
  const {
    children,
    nodeId,
    onMouseDown,
    onTouchStart,
    onKeyDown,
    ...other
  } = props;
  const { startScrollOnMove, endScrollOnMove } = useScrollOnMove();

  const classes = useStyles();

  const { draggable, allowDrop, onDrop } = React.useContext(
    TreeViewDraggableContext
  );

  const draggingStateRef = React.useRef<{
    fromItemElement: Element;
    toItemElement: Element;
    treeViewElement: Element;
    scrollContainer: Element;
    position: Position;
    toNodeId: string;
  }>({
    fromItemElement: null,
    toItemElement: null,
    treeViewElement: null,
    scrollContainer: null,
    position: null,
    toNodeId: null,
  });

  const allowDropInternal = React.useCallback(
    (
      toItemElementParam: Element,
      positionParam: Position,
      toNodeIdParam: string
    ): boolean => {
      const { fromItemElement } = draggingStateRef.current;

      if (fromItemElement.contains(toItemElementParam)) {
        return false;
      }

      if (
        allowDrop &&
        !allowDrop({
          fromNodeId: nodeId,
          toNodeId: toNodeIdParam,
          position: positionParam,
        })
      ) {
        return false;
      }

      return true;
    },
    [allowDrop, nodeId]
  );

  const clearDropTarget = React.useCallback((): void => {
    const { position, toItemElement } = draggingStateRef.current;

    if (toItemElement) {
      toItemElement.classList.remove("drop", position);
    }

    draggingStateRef.current.toItemElement = null;
    draggingStateRef.current.position = null;
    draggingStateRef.current.toNodeId = null;
  }, []);

  const setDropTarget = React.useCallback(
    (
      toItemElementParam: Element,
      positionParam: Position,
      toNodeIdParam: string
    ): void => {
      clearDropTarget();

      draggingStateRef.current.toItemElement = toItemElementParam;
      draggingStateRef.current.position = positionParam;
      draggingStateRef.current.toNodeId = toNodeIdParam;

      toItemElementParam.classList.add("drop", positionParam);
    },
    [clearDropTarget]
  );

  const handleDragStart = React.useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      const fromItemElement = (event.target as Element).closest(
        ".MuiTreeItem-root"
      );
      const treeViewElement = fromItemElement.closest(".MuiTreeView-root");
      const scrollContainer = getScrollContaneir(fromItemElement);

      draggingStateRef.current = {
        fromItemElement,
        toItemElement: null,
        treeViewElement,
        scrollContainer,
        position: null,
        toNodeId: null,
      };

      fromItemElement.setAttribute("data-dragging", "true");
      treeViewElement.setAttribute("data-dragging", "true");
      startScrollOnMove(scrollContainer);
    },
    [startScrollOnMove]
  );

  const handleDragMove = React.useCallback(
    (event: MouseEvent | TouchEvent) => {
      const { clientX, clientY } = getClientPosition(event);

      const nextToItemElement = document
        .elementFromPoint(clientX, clientY)
        ?.closest(".MuiTreeItem-root");

      if (!nextToItemElement) {
        clearDropTarget();
        return;
      }

      const nextPosition = getDropPosition(nextToItemElement, clientX, clientY);
      const nextToNodeId = nextToItemElement.getAttribute("data-nodeid");

      if (allowDropInternal(nextToItemElement, nextPosition, nextToNodeId)) {
        setDropTarget(nextToItemElement, nextPosition, nextToNodeId);
      }
    },
    [allowDropInternal, clearDropTarget, setDropTarget]
  );

  const handleDragKey = React.useCallback((event: KeyboardEvent) => {
    console.log("key", event.target);
  }, []);

  const handleDragEnd = React.useCallback(() => {
    const {
      fromItemElement,
      toItemElement,
      treeViewElement,
      toNodeId,
      position,
    } = draggingStateRef.current;

    fromItemElement.removeAttribute("data-dragging");
    treeViewElement.removeAttribute("data-dragging");

    if (toItemElement) {
      toItemElement.classList.remove("drop", position);
    }

    if (onDrop && toNodeId) {
      onDrop({ fromNodeId: nodeId, toNodeId, position });
    }

    endScrollOnMove();
  }, [endScrollOnMove, nodeId, onDrop]);

  const { handleMouseDown, handleTouchStart, handleKeyDown } = useDragging({
    active: draggable,
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

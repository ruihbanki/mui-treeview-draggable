import React from "react";
import TreeItem from "@material-ui/lab/TreeItem";

import { TreeItemProps } from "@material-ui/lab/TreeItem/TreeItem.d";
import TreeViewDraggableContext from "../TreeViewDraggable/TreeViewDraggableContext";
import useStyles from "./TreeItemDraggable.styles";
import useDragging from "../../hooks/useDragging";
import useScrollOnMove from "../../hooks/useScrollOnMove";
import {
  getScrollContaneir,
  getEventClientPosition,
} from "../../utils/htmlUtils";
import {
  createDropTargetList,
  getDropPosition,
} from "./TreeItemDraggable.helper";

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

  const dropTargetListRef = React.useRef<
    { position: Position; toItemElement: Element }[]
  >([]);

  const allowDropInternal = React.useCallback(
    (toItemElementParam: Element, positionParam: Position): boolean => {
      const { fromItemElement } = draggingStateRef.current;

      const toNodeId = toItemElementParam.getAttribute("data-nodeid");

      if (fromItemElement.contains(toItemElementParam)) {
        return false;
      }

      if (
        allowDrop &&
        !allowDrop({
          fromNodeId: nodeId,
          toNodeId: toNodeId,
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
    (toItemElementParam: Element, positionParam: Position): void => {
      clearDropTarget();

      draggingStateRef.current.toItemElement = toItemElementParam;
      draggingStateRef.current.position = positionParam;
      draggingStateRef.current.toNodeId = toItemElementParam.getAttribute(
        "data-nodeid"
      );

      toItemElementParam.classList.add("drop", positionParam);
    },
    [clearDropTarget]
  );

  const handleDragStart = React.useCallback(
    (event) => {
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

      if (event.type !== "keydown") {
        startScrollOnMove(scrollContainer);
      } else {
        dropTargetListRef.current = createDropTargetList(treeViewElement);
      }
    },
    [startScrollOnMove]
  );

  const handleDragMove = React.useCallback(
    (event: MouseEvent | TouchEvent) => {
      const { clientX, clientY } = getEventClientPosition(event);

      const nextToItemElement = document
        .elementFromPoint(clientX, clientY)
        ?.closest(".MuiTreeItem-root");

      if (!nextToItemElement) {
        clearDropTarget();
        return;
      }

      const nextPosition = getDropPosition(nextToItemElement, clientX, clientY);

      if (allowDropInternal(nextToItemElement, nextPosition)) {
        setDropTarget(nextToItemElement, nextPosition);
      }
    },
    [allowDropInternal, clearDropTarget, setDropTarget]
  );

  const handleDragKey = React.useCallback(
    (event: KeyboardEvent) => {
      const { toItemElement, position } = draggingStateRef.current;

      const curIndex = dropTargetListRef.current.findIndex(
        (item) =>
          (item.toItemElement === toItemElement &&
            item.position === position) ||
          !position
      );
      let nextIndex = curIndex;

      switch (event.key) {
        case "ArrowUp": {
          if (nextIndex > 0) {
            nextIndex--;
          }
          break;
        }
        case "ArrowDown": {
          if (nextIndex < dropTargetListRef.current.length - 1) {
            nextIndex++;
          }
          break;
        }
      }

      if (nextIndex !== -1) {
        const nextDropTarget = dropTargetListRef.current[nextIndex];
        console.log(nextDropTarget);

        setDropTarget(nextDropTarget.toItemElement, nextDropTarget.position);
      }
    },
    [setDropTarget]
  );

  const handleDragEnd = React.useCallback(
    (event) => {
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

      if (onDrop && toNodeId && position) {
        onDrop({ fromNodeId: nodeId, toNodeId, position });
      }

      if (event.type !== "keydown") {
        endScrollOnMove();
      }
    },
    [endScrollOnMove, nodeId, onDrop]
  );

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

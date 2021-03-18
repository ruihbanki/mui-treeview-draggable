import React from "react";
import TreeItem from "@material-ui/lab/TreeItem";
import { TreeItemProps } from "@material-ui/lab/TreeItem/TreeItem.d";

import {
  getScrollContaneir,
  getEventClientPosition,
} from "../../utils/htmlUtils";
import useDragging from "../../hooks/useDragging";
import useScrollOnMove from "../../hooks/useScrollOnMove";
import { Position } from "../TreeViewDraggable/TreeViewDraggable.types";
import TreeViewDraggableContext from "../TreeViewDraggable/TreeViewDraggableContext";
import useStyles from "./TreeItemDraggable.styles";
import {
  createDropTargetList,
  createPositionA11y,
  destroyPositionA11y,
  getDropPosition,
} from "./TreeItemDraggable.helper";

interface DragState {
  fromItemElement: Element;
  toItemElement: Element;
  treeViewElement: Element;
  scrollContainer: Element;
  position: Position;
  toNodeId: string;
}

interface DropTargetList {
  position: Position;
  toItemElement: Element;
}

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

  const draggingStateRef = React.useRef<DragState>({
    fromItemElement: null,
    toItemElement: null,
    treeViewElement: null,
    scrollContainer: null,
    position: null,
    toNodeId: null,
  });

  const dropTargetListRef = React.useRef<DropTargetList[]>([]);

  const allowDropInternal = React.useCallback(
    (toItemElementParam: Element, positionParam: Position): boolean => {
      const { fromItemElement } = draggingStateRef.current;

      const toNodeId = toItemElementParam.getAttribute("data-nodeid");

      if (fromItemElement.contains(toItemElementParam)) {
        return false;
      }

      if (
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

      const toNodeId = toItemElementParam.getAttribute("data-nodeid");
      draggingStateRef.current.toItemElement = toItemElementParam;
      draggingStateRef.current.position = positionParam;
      draggingStateRef.current.toNodeId = toNodeId;

      toItemElementParam.classList.add("drop", positionParam);

      const { fromItemElement } = draggingStateRef.current;
      const describedby = `treeview-drop-position-${positionParam} ${toNodeId}`;
      fromItemElement.setAttribute("aria-describedby", describedby);
    },
    [clearDropTarget]
  );

  const setDropTargetIfAllowed = React.useCallback(
    (index) => {
      const nextDropTarget = dropTargetListRef.current[index];
      if (
        allowDropInternal(nextDropTarget.toItemElement, nextDropTarget.position)
      ) {
        setDropTarget(nextDropTarget.toItemElement, nextDropTarget.position);
        return true;
      }
      return false;
    },
    [allowDropInternal, setDropTarget]
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
        toItemElement: fromItemElement,
        treeViewElement,
        scrollContainer,
        position: null,
        toNodeId: null,
      };

      fromItemElement.setAttribute("data-dragging", "true");
      fromItemElement.setAttribute("aria-grabbed", "true");
      treeViewElement.setAttribute("data-dragging", "true");

      if (event.type !== "keydown") {
        startScrollOnMove(scrollContainer);
      } else {
        dropTargetListRef.current = createDropTargetList(treeViewElement);
        createPositionA11y();
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
          item.toItemElement === toItemElement &&
          (item.position === position || !position)
      );
      let nextIndex = curIndex;

      switch (event.key) {
        case "ArrowUp": {
          while (nextIndex > 0) {
            nextIndex--;
            if (setDropTargetIfAllowed(nextIndex)) {
              break;
            }
          }
          break;
        }
        case "ArrowDown": {
          while (nextIndex < dropTargetListRef.current.length - 1) {
            nextIndex++;
            if (setDropTargetIfAllowed(nextIndex)) {
              break;
            }
          }
          break;
        }
      }
    },
    [setDropTargetIfAllowed]
  );

  const handleDragCancel = React.useCallback(
    (event) => {
      const {
        fromItemElement,
        toItemElement,
        treeViewElement,
        position,
      } = draggingStateRef.current;

      fromItemElement.removeAttribute("data-dragging");
      fromItemElement.setAttribute("aria-grabbed", "false");
      treeViewElement.removeAttribute("data-dragging");

      if (toItemElement) {
        toItemElement.classList.remove("drop", position);
      }

      if (event.type !== "keydown") {
        endScrollOnMove();
      } else {
        destroyPositionA11y();
      }
    },
    [endScrollOnMove]
  );

  const handleDragEnd = React.useCallback(
    (event) => {
      handleDragCancel(event);

      const { toNodeId, position } = draggingStateRef.current;
      if (onDrop && toNodeId && position) {
        onDrop({ fromNodeId: nodeId, toNodeId, position });
      }
    },
    [handleDragCancel, nodeId, onDrop]
  );

  const { handleMouseDown, handleTouchStart, handleKeyDown } = useDragging({
    active: draggable,
    onStart: handleDragStart,
    onMove: handleDragMove,
    onKey: handleDragKey,
    onCancel: handleDragCancel,
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
      aria-grabbed={draggable ? false : undefined}
    >
      {children}
    </TreeItem>
  );
}

export default TreeItemDraggable;

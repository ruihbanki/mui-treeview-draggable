import React from "react";
import MuiTreeItem from "@material-ui/lab/TreeItem";
import { TreeItemProps } from "@material-ui/lab/TreeItem/TreeItem.d";

import {
  getScrollContaneir,
  getEventClientPosition,
} from "../../utils/htmlUtils";
import useDragging from "../../hooks/useDragging";
import useScrollOnMove from "../../hooks/useScrollOnMove";
import { Position } from "../TreeView/TreeView.types";
import TreeViewContext from "../TreeView/TreeViewContext";
import useStyles from "./TreeItem.styles";
import {
  createDropTargetList,
  createPositionA11y,
  destroyPositionA11y,
  getDropPosition,
} from "./TreeItem.helper";
import { DragState, DropTargetList } from "./TreeItem.types";

function TreeItem(props: TreeItemProps): JSX.Element {
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

  const { draggable, allowNodeDrop, onNodeDrop } = React.useContext(
    TreeViewContext
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

  const allowNodeDropInternal = React.useCallback(
    (toItemElementParam: Element, positionParam: Position): boolean => {
      const { fromItemElement } = draggingStateRef.current;

      const toNodeId = toItemElementParam.getAttribute("data-nodeid");

      if (fromItemElement.contains(toItemElementParam)) {
        return false;
      }

      if (
        !allowNodeDrop({
          fromNodeId: nodeId,
          toNodeId: toNodeId,
          position: positionParam,
        })
      ) {
        return false;
      }

      return true;
    },
    [allowNodeDrop, nodeId]
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
        allowNodeDropInternal(
          nextDropTarget.toItemElement,
          nextDropTarget.position
        )
      ) {
        setDropTarget(nextDropTarget.toItemElement, nextDropTarget.position);
        return true;
      }
      return false;
    },
    [allowNodeDropInternal, setDropTarget]
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

      if (allowNodeDropInternal(nextToItemElement, nextPosition)) {
        setDropTarget(nextToItemElement, nextPosition);
      }
    },
    [allowNodeDropInternal, clearDropTarget, setDropTarget]
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
      if (onNodeDrop && toNodeId && position) {
        onNodeDrop({ fromNodeId: nodeId, toNodeId, position });
      }
    },
    [handleDragCancel, nodeId, onNodeDrop]
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
    <MuiTreeItem
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
    </MuiTreeItem>
  );
}

export default TreeItem;

import React from "react";
import TreeItem from "@material-ui/lab/TreeItem";

import { TreeItemProps } from "@material-ui/lab/TreeItem/TreeItem.d";
import TreeViewDraggableContext from "../TreeViewDraggable/TreeViewDraggableContext";
import useStyles from "./TreeItemDraggable.styles";
import useDragging from "../../hooks/useDragging";
import useScrollOnMove from "../../hooks/useScrollOnMove";
import { getScrollContaneir, getClientPosition } from "../../utils/htmlUtils";
import { getDropPosition } from "./TreeItemDraggable.helper";

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

  const { startScrollOnMove, endScrollOnMove } = useScrollOnMove();

  const { allowDragging } = React.useContext(TreeViewDraggableContext);

  const draggingStateRef = React.useRef<{
    fromItemElement: Element;
    toItemElement: Element;
    treeViewElement: Element;
    scrollContainer: Element;
    position: "before" | "after" | "inside" | null;
  }>({
    fromItemElement: null,
    toItemElement: null,
    treeViewElement: null,
    scrollContainer: null,
    position: null,
  });

  const handleDragStart = React.useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      console.log("start", event.target);
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
      };

      fromItemElement.setAttribute("data-dragging", "true");
      treeViewElement.setAttribute("data-dragging", "true");
      startScrollOnMove(scrollContainer);
    },
    [startScrollOnMove]
  );

  const handleDragMove = React.useCallback((event: MouseEvent | TouchEvent) => {
    const { clientX, clientY } = getClientPosition(event);

    const {
      position,
      fromItemElement,
      toItemElement,
    } = draggingStateRef.current;

    if (toItemElement) {
      toItemElement.classList.remove("drop", position);
    }

    const nextToItemElement = document
      .elementFromPoint(clientX, clientY)
      .closest(".MuiTreeItem-root");

    draggingStateRef.current.toItemElement = nextToItemElement;

    if (!nextToItemElement) {
      draggingStateRef.current.position = null;
      return;
    }

    const expanded = Array.from(nextToItemElement.children).some((elem) =>
      elem.classList.contains("MuiTreeItem-group")
    );
    const toNodeId = nextToItemElement.getAttribute("data-nodeid");

    const nextPosition = getDropPosition(nextToItemElement, clientX, clientY);
    draggingStateRef.current.position = nextPosition;

    if (!fromItemElement.contains(nextToItemElement)) {
      nextToItemElement.classList.add("drop", nextPosition);
    }
  }, []);

  const handleDragKey = React.useCallback((event: KeyboardEvent) => {
    console.log("key", event.target);
  }, []);

  const handleDragEnd = React.useCallback(
    (event: MouseEvent | TouchEvent) => {
      console.log("end", event.target);
      const { fromItemElement, treeViewElement } = draggingStateRef.current;
      fromItemElement.removeAttribute("data-dragging");
      treeViewElement.removeAttribute("data-dragging");
      endScrollOnMove();
    },
    [endScrollOnMove]
  );

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

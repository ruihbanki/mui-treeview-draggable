import React from "react";
import TreeItem from "@material-ui/lab/TreeItem";

import { TreeItemProps } from "@material-ui/lab/TreeItem/TreeItem.d";
import TreeViewDraggableContext from "../TreeViewDraggable/TreeViewDraggableContext";
import useStyles from "./TreeItemDraggable.styles";
import useScrollOnMove from "../../hooks/useScrollOnMove";
import { getScrollContaneir } from "../../utils/htmlUtils";

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

  const { startScrollOnMove, endScrollOnMove } = useScrollOnMove();

  const classes = useStyles();

  const { allowDragging, onDrop } = React.useContext(TreeViewDraggableContext);

  const timeoutRef = React.useRef<NodeJS.Timeout>(null);

  const draggingRef = React.useRef<boolean>(false);

  const rootTreeRef = React.useRef<HTMLUListElement>(null);

  const fromLiRef = React.useRef<HTMLLIElement>(null);

  const toLiRef = React.useRef<HTMLLIElement>(null);

  const toNodeIdRef = React.useRef<string>(null);

  const positionRef = React.useRef<"before" | "after" | "inside">(null);

  const drop = React.useCallback(() => {
    if (onDrop && toNodeIdRef.current && positionRef.current) {
      onDrop({
        fromNodeId: nodeId,
        toNodeId: toNodeIdRef.current,
        position: positionRef.current,
      });
    }
  }, [onDrop, nodeId]);

  const pointerMoveListener = React.useCallback((event) => {
    const clientX = event.clientX;
    const clientY = event.clientY;
    const li = document
      .elementFromPoint(clientX, clientY)
      .closest(".MuiTreeItem-root") as HTMLLIElement;
    if (toLiRef.current) {
      toLiRef.current.classList.remove("drop", positionRef.current);
    }
    toLiRef.current = li;
    if (!li) {
      toNodeIdRef.current = null;
      positionRef.current = null;
      return;
    }
    toNodeIdRef.current = li.getAttribute("data-nodeid");
    const expanded = Array.from(li.children).some((elem) =>
      elem.classList.contains("MuiTreeItem-group")
    );
    const position = getDropPosition(li, clientX, clientY);
    positionRef.current = position;
    if (
      !fromLiRef.current.contains(li) &&
      !(expanded && position === "after")
    ) {
      toLiRef.current.classList.add("drop", positionRef.current);
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
    rootTreeRef.current.removeAttribute("data-dragging");
    fromLiRef.current.removeAttribute("data-dragging");
    fromLiRef.current = null;
    if (toLiRef.current) {
      toLiRef.current.classList.remove("drop", positionRef.current);
      toLiRef.current = null;
    }
    endScrollOnMove();
    document.removeEventListener("click", clickListener);
    document.removeEventListener("pointermove", pointerMoveListener);
    drop();
  }, [endScrollOnMove, pointerMoveListener, drop]);

  const handleLabelClick = React.useCallback(
    (event) => {
      if (draggingRef.current) {
        event.stopPropagation();
        draggingRef.current = false;
        if (fromLiRef.current) {
          fromLiRef.current.removeAttribute("data-dragging");
          fromLiRef.current = null;
        }
        if (toLiRef.current) {
          toLiRef.current.classList.remove("drop", positionRef.current);
          toLiRef.current = null;
        }
        if (rootTreeRef.current) {
          rootTreeRef.current.removeAttribute("data-dragging");
        }
        endScrollOnMove();
        document.removeEventListener("click", clickListener);
        document.removeEventListener("pointermove", pointerMoveListener);
        drop();
      }
      if (onLabelClick) {
        onLabelClick(event);
      }
    },
    [clickListener, endScrollOnMove, onLabelClick, pointerMoveListener, drop]
  );

  const handleMouseDown = React.useCallback(
    (event) => {
      if (allowDragging) {
        event.stopPropagation();
        const li = getNodeElement(event);
        document.addEventListener("mouseup", mouseUpListener);
        document.addEventListener("mousemove", mouseMoveListener);
        timeoutRef.current = setTimeout(() => {
          draggingRef.current = true;
          fromLiRef.current = li;
          fromLiRef.current.setAttribute("data-dragging", "true");
          rootTreeRef.current = getTreeRootElement(li);
          rootTreeRef.current.setAttribute("data-dragging", "true");
          const scrollContainer = getScrollContaneir(li);
          startScrollOnMove(scrollContainer);
          document.addEventListener("click", clickListener);
          document.addEventListener("pointermove", pointerMoveListener);
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
      onMouseDown,
      pointerMoveListener,
      startScrollOnMove,
    ]
  );

  const touchMoveListener = React.useCallback(() => {
    clearTimeout(timeoutRef.current);
  }, []);

  const touchEndListener = React.useCallback(() => {
    clearTimeout(timeoutRef.current);
    draggingRef.current = false;
    if (fromLiRef.current) {
      fromLiRef.current.removeAttribute("data-dragging");
      fromLiRef.current = null;
    }
    if (toLiRef.current) {
      toLiRef.current.classList.remove("drop", positionRef.current);
      toLiRef.current = null;
    }
    if (rootTreeRef.current) {
      rootTreeRef.current.removeAttribute("data-dragging");
    }
    endScrollOnMove();
    document.removeEventListener("touchend", touchEndListener);
    document.removeEventListener("touchmove", touchMoveListener);
    document.removeEventListener("pointermove", pointerMoveListener);
    drop();
  }, [endScrollOnMove, touchMoveListener, pointerMoveListener, drop]);

  const handleTouchStart = React.useCallback(
    (event) => {
      if (allowDragging) {
        event.stopPropagation();
        const li = getNodeElement(event);
        document.addEventListener("touchend", touchEndListener);
        document.addEventListener("touchmove", touchMoveListener);
        timeoutRef.current = setTimeout(() => {
          draggingRef.current = true;
          fromLiRef.current = li;
          fromLiRef.current.setAttribute("data-dragging", "true");
          rootTreeRef.current = getTreeRootElement(li);
          rootTreeRef.current.setAttribute("data-dragging", "true");
          const scrollContainer = getScrollContaneir(li);
          startScrollOnMove(scrollContainer);
          document.addEventListener("pointermove", pointerMoveListener);
        }, LONG_PRESS);
      }
      if (onTouchStart) {
        onTouchStart(event);
      }
    },
    [
      allowDragging,
      onTouchStart,
      touchEndListener,
      touchMoveListener,
      startScrollOnMove,
      pointerMoveListener,
    ]
  );

  const handleKeyDown = React.useCallback(() => {
    // event.stopPropagation();
    // console.log("key down", event.key);
  }, []);

  return (
    <TreeItem
      {...other}
      classes={classes}
      data-nodeid={nodeId}
      nodeId={nodeId}
      onMouseDown={handleMouseDown}
      onLabelClick={handleLabelClick}
      onTouchStart={handleTouchStart}
      onKeyDownCapture={handleKeyDown}
    >
      {children}
    </TreeItem>
  );
}

function getNodeElement(event) {
  return event.currentTarget.closest(".MuiTreeItem-root") as HTMLLIElement;
}

function getTreeRootElement(li: HTMLLIElement) {
  return li.closest(".MuiTreeView-root") as HTMLUListElement;
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

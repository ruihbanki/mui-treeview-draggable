import React from "react";
import TreeItem from "@material-ui/lab/TreeItem";

import { TreeItemProps } from "@material-ui/lab/TreeItem/TreeItem.d";
import TreeViewDraggableContext from "../TreeViewDraggable/TreeViewDraggableContext";
import useStyles from "./TreeItemDraggable.styles";

const LONG_PRESS = 500;

function TreeItemDraggable(props: TreeItemProps): JSX.Element {
  const { children, onMouseDown, onLabelClick, onTouchStart, ...other } = props;

  const classes = useStyles();

  const { allowDragging, dragging, setDragging } = React.useContext(
    TreeViewDraggableContext
  );

  const timeoutRef = React.useRef<NodeJS.Timeout>(null);

  const handleMouseDown = (event) => {
    if (allowDragging) {
      event.stopPropagation();
      document.addEventListener("mouseup", mouseUpListener);
      document.addEventListener("mousemove", mouseMoveListener);
      timeoutRef.current = setTimeout(() => {
        document.addEventListener("click", clickListener);
        setDragging(true);
      }, LONG_PRESS);
    }

    if (onMouseDown) {
      onMouseDown(event);
    }
  };

  const handleLabelClick = (event) => {
    if (dragging) {
      event.stopPropagation();
      document.removeEventListener("click", clickListener);
      setDragging(false);
    }

    if (onLabelClick) {
      onLabelClick(event);
    }
  };

  const mouseUpListener = () => {
    clearTimeout(timeoutRef.current);
    document.removeEventListener("mouseup", mouseUpListener);
    document.removeEventListener("mousemove", mouseMoveListener);
  };

  const mouseMoveListener = () => {
    clearTimeout(timeoutRef.current);
  };

  const clickListener = () => {
    document.removeEventListener("click", clickListener);
    setDragging(false);
  };

  const handleTouchStart = (event) => {
    if (allowDragging) {
      event.stopPropagation();
      event.currentTarget.addEventListener("touchend", touchEndListener);
      timeoutRef.current = setTimeout(() => {
        setDragging(true);
      }, LONG_PRESS);
    }

    if (onTouchStart) {
      onTouchStart(event);
    }
  };

  const touchEndListener = (event) => {
    clearTimeout(timeoutRef.current);
    event.currentTarget.removeEventListener("touchend", touchEndListener);
  };

  return (
    <TreeItem
      {...other}
      classes={classes}
      data-dragging={dragging}
      onMouseDown={handleMouseDown}
      onLabelClick={handleLabelClick}
      onTouchStart={handleTouchStart}
    >
      {children}
    </TreeItem>
  );
}

export default TreeItemDraggable;

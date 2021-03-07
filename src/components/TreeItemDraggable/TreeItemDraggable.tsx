import React from "react";
import TreeItem from "@material-ui/lab/TreeItem";

import { TreeItemProps } from "@material-ui/lab/TreeItem/TreeItem.d";
import TreeViewDraggableContext from "../TreeViewDraggable/TreeViewDraggableContext";
import useStyles from "./TreeItemDraggable.styles";

const LONG_PRESS = 500;

function TreeItemDraggable(props: TreeItemProps): JSX.Element {
  const { children, onMouseDown, onTouchStart, ...other } = props;

  const classes = useStyles();

  const { allowDragging } = React.useContext(TreeViewDraggableContext);

  const timeoutRef = React.useRef<NodeJS.Timeout>(null);

  const [dragging, setDragging] = React.useState(false);

  const mouseUpListener = (event) => {
    clearTimeout(timeoutRef.current);

    event.currentTarget.removeEventListener("mouseup", mouseUpListener);
    event.currentTarget.removeEventListener("mousemove", mouseMoveListener);
  };

  const mouseMoveListener = () => {
    clearTimeout(timeoutRef.current);
  };

  const handleMouseDown = (event) => {
    if (allowDragging) {
      event.currentTarget.addEventListener("mouseup", mouseUpListener);
      event.currentTarget.addEventListener("mousemove", mouseMoveListener);
      timeoutRef.current = setTimeout(() => {
        setDragging(true);
      }, LONG_PRESS);
    }

    if (onMouseDown) {
      onMouseDown(event);
    }
  };

  const touchEndListener = (event) => {
    clearTimeout(timeoutRef.current);

    event.currentTarget.removeEventListener("touchend", touchEndListener);
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

  return (
    <TreeItem
      {...other}
      classes={classes}
      data-dragging={dragging}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {children}
    </TreeItem>
  );
}

export default TreeItemDraggable;

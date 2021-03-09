import React from "react";
import TreeView from "@material-ui/lab/TreeView";

import TreeViewDraggableProps from "./TreeViewDraggableProps";
import TreeViewDraggableContext from "./TreeViewDraggableContext";
import useStyles from "./TreeViewDraggable.styles";
import useScrollOnMove from "../../hooks/useScrollOnMove";
import { getScrollContaneir } from "../../utils/htmlUtils";

function TreeViewDraggable(props: TreeViewDraggableProps): JSX.Element {
  const { children, allowDragging, onDrop, ...other } = props;

  const { startScrollOnMove, endScrollOnMove } = useScrollOnMove();

  const classes = useStyles(props);

  const [dragging, setDragging] = React.useState(false);

  const [fromNodeId, setFromNodeId] = React.useState(null);

  const startDragging = React.useCallback(
    (target: HTMLElement, fromNodeIdParam: string) => {
      console.log("startDragging", fromNodeIdParam);
      setDragging(true);
      setFromNodeId(fromNodeIdParam);
      const scrollContainer = getScrollContaneir(target);
      console.log(target);

      startScrollOnMove(scrollContainer);
    },
    [startScrollOnMove]
  );

  const stopDragging = React.useCallback(() => {
    console.log("stopDragging");
    setDragging(false);
    setFromNodeId(null);
    endScrollOnMove();
  }, [endScrollOnMove]);

  const contextValue = {
    allowDragging,
    startDragging,
    stopDragging,
    onDrop,
    fromNodeId,
  };

  return (
    <TreeViewDraggableContext.Provider value={contextValue}>
      <TreeView {...other} classes={classes} data-dragging={dragging}>
        {children}
      </TreeView>
    </TreeViewDraggableContext.Provider>
  );
}

export default TreeViewDraggable;

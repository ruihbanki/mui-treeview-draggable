import React from "react";
import TreeView from "@material-ui/lab/TreeView";

import TreeViewDraggableProps from "./TreeViewDraggableProps";
import TreeViewDraggableContext from "./TreeViewDraggableContext";
import useStyles from "./TreeViewDraggable.styles";

function TreeViewDraggable(props: TreeViewDraggableProps): JSX.Element {
  const { children, allowDragging, onDrop, ...other } = props;

  const classes = useStyles(props);

  const contextValue = {
    allowDragging,
    onDrop,
  };

  return (
    <TreeViewDraggableContext.Provider value={contextValue}>
      <TreeView {...other} classes={classes}>
        {children}
      </TreeView>
    </TreeViewDraggableContext.Provider>
  );
}

export default TreeViewDraggable;

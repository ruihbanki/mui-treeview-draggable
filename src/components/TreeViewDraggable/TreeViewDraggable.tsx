import React from "react";
import TreeView from "@material-ui/lab/TreeView";

import TreeViewDraggableProps from "./TreeViewDraggableProps";
import TreeViewDraggableContext from "./TreeViewDraggableContext";
import useStyles from "./TreeViewDraggable.styles";

function TreeViewDraggable(props: TreeViewDraggableProps): JSX.Element {
  const { children, draggable, onDrop, allowDrop, ...other } = props;

  const classes = useStyles(props);

  const contextValue = {
    draggable,
    onDrop,
    allowDrop,
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

import React from "react";
import TreeView from "@material-ui/lab/TreeView";

import TreeViewDraggableProps from "./TreeViewDraggableProps";
import TreeViewDraggableContext from "./TreeViewDraggableContext";

function TreeViewDraggable(props: TreeViewDraggableProps): JSX.Element {
  const { children, allowDragging, ...other } = props;

  const contextValue = React.useMemo(() => {
    return {
      allowDragging,
    };
  }, [allowDragging]);

  return (
    <TreeViewDraggableContext.Provider value={contextValue}>
      <TreeView {...other}>{children}</TreeView>
    </TreeViewDraggableContext.Provider>
  );
}

export default TreeViewDraggable;

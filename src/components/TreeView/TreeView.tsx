import React from "react";
import MuiTreeView from "@material-ui/lab/TreeView";

import { TreeViewProps } from "./TreeView.types";
import TreeViewContext from "./TreeViewContext";
import useStyles from "./TreeView.styles";

function TreeView(props: TreeViewProps): JSX.Element {
  const {
    children,
    draggable,
    onDrop,
    allowDrop = () => true,
    ...other
  } = props;

  const classes = useStyles(props);

  const contextValue = {
    draggable,
    onDrop,
    allowDrop,
  };

  return (
    <TreeViewContext.Provider value={contextValue}>
      <MuiTreeView {...other} classes={classes}>
        {children}
      </MuiTreeView>
    </TreeViewContext.Provider>
  );
}

export default TreeView;

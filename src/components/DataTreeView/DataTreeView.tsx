import React from "react";
import TreeItem from "../TreeItem";
import TreeView from "../TreeView";
import { DataTreeViewProps } from "./DataTreeView.types";

function DataTreeView(props: DataTreeViewProps): JSX.Element {
  const { getNodeId, getNodeLabel, getNodeChildren, data, ...other } = props;

  const renderNode = React.useCallback(
    (node) => {
      const nodeId = getNodeId(node);
      const label = getNodeLabel(node);
      const childrenNodes = getNodeChildren(node);
      return (
        <TreeItem nodeId={nodeId} label={label}>
          {childrenNodes?.map((childNode) => renderNode(childNode))}
        </TreeItem>
      );
    },
    [getNodeChildren, getNodeId, getNodeLabel]
  );

  const children = React.useMemo(() => {
    return data?.map((node) => renderNode(node));
  }, [data, renderNode]);

  return <TreeView {...other}>{children}</TreeView>;
}

export default DataTreeView;

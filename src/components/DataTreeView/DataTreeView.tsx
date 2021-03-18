import React from "react";
import TreeItem from "../TreeItem";
import TreeView from "../TreeView";
import { DataTreeViewProps } from "./DataTreeView.types";

const renderLabelDefault = (node) => node.label;

function DataTreeView(props: DataTreeViewProps): JSX.Element {
  const { treeData, renderLabel = renderLabelDefault, ...other } = props;

  const renderNode = React.useCallback(
    (node) => {
      const label = renderLabel(node);
      return (
        <TreeItem nodeId={node.id} label={label}>
          {node.children?.map((childNode) => renderNode(childNode))}
        </TreeItem>
      );
    },
    [renderLabel]
  );

  const children = React.useMemo(() => {
    return treeData?.map((node) => renderNode(node));
  }, [treeData, renderNode]);

  return <TreeView {...other}>{children}</TreeView>;
}

export default DataTreeView;

import React from "react";

import { findNode, insertNode, removeNode } from "../../utils/treeUtils";
import TreeView from "../TreeView";
import { Position } from "../TreeView/TreeView.types";
import TreeItem from "../TreeItem";
import { DataTreeViewProps } from "./DataTreeView.types";

const renderLabelDefault = (node) => node.label;

function DataTreeView(props: DataTreeViewProps): JSX.Element {
  const {
    treeData,
    renderLabel = renderLabelDefault,
    onNodeDrop,
    ...other
  } = props;

  const handleNodeDrop = React.useCallback(
    ({
      fromNodeId,
      toNodeId,
      position,
    }: {
      fromNodeId: string;
      toNodeId: string;
      position: Position;
    }) => {
      if (onNodeDrop) {
        const fromNode = findNode(treeData, fromNodeId);
        const treeDataRemoved = removeNode(treeData, fromNodeId);
        const treeDataInserted = insertNode(
          treeDataRemoved,
          toNodeId,
          position,
          fromNode
        );
        onNodeDrop({
          fromNodeId,
          toNodeId,
          position,
          treeData: treeDataInserted,
        });
      }
    },
    [onNodeDrop, treeData]
  );

  const renderNode = React.useCallback(
    (node) => {
      const label = renderLabel(node);
      return (
        <TreeItem key={node.id} nodeId={node.id} label={label}>
          {node.children?.map((childNode) => renderNode(childNode))}
        </TreeItem>
      );
    },
    [renderLabel]
  );

  const children = React.useMemo(() => {
    return treeData?.map((node) => renderNode(node));
  }, [treeData, renderNode]);

  return (
    <TreeView {...other} onNodeDrop={handleNodeDrop}>
      {children}
    </TreeView>
  );
}

export default DataTreeView;

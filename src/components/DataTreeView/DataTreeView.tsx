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
    renderIcon,
    renderEndIcon,
    renderCollapseIcon,
    renderExpandIcon,
    onNodeDrop,
    allowNodeDrop,
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
        const toNode = findNode(treeData, toNodeId);
        const treeDataRemoved = removeNode(treeData, fromNodeId);
        const treeDataInserted = insertNode(
          treeDataRemoved,
          toNodeId,
          position,
          fromNode
        );
        onNodeDrop({
          fromNode,
          toNode,
          position,
          treeData: treeDataInserted,
        });
      }
    },
    [onNodeDrop, treeData]
  );

  const handleAllowNodeDrop = ({ fromNodeId, toNodeId, position }) => {
    if (!allowNodeDrop) {
      return true;
    } else {
      const fromNode = findNode(treeData, fromNodeId);
      const toNode = findNode(treeData, toNodeId);
      return allowNodeDrop({
        fromNode,
        toNode,
        position,
      });
    }
  };

  const renderNode = React.useCallback(
    (node) => {
      const label = renderLabel(node);
      const icon = renderIcon ? renderIcon(node) : null;
      const endIcon = renderEndIcon ? renderEndIcon(node) : null;
      const expandIcon = renderExpandIcon ? renderExpandIcon(node) : null;
      const collapseIcon = renderCollapseIcon ? renderCollapseIcon(node) : null;
      return (
        <TreeItem
          key={node.id}
          nodeId={node.id}
          label={label}
          icon={icon}
          expandIcon={expandIcon}
          endIcon={endIcon}
          collapseIcon={collapseIcon}
        >
          {node.children?.map((childNode) => renderNode(childNode))}
        </TreeItem>
      );
    },
    [
      renderLabel,
      renderIcon,
      renderEndIcon,
      renderExpandIcon,
      renderCollapseIcon,
    ]
  );

  const children = React.useMemo(() => {
    return treeData?.map((node) => renderNode(node));
  }, [treeData, renderNode]);

  /* eslint-disable */
  const anyOther = other as any;

  return (
    <TreeView
      {...anyOther}
      onNodeDrop={handleNodeDrop}
      allowNodeDrop={handleAllowNodeDrop}
    >
      {children}
    </TreeView>
  );
}

export default DataTreeView;

import { Node } from "../components/DataTreeView/DataTreeView.types";

type NodeData = {
  node: Node;
  parent: Node | null;
  level: number;
};

type NodeDataByKey = { [id: string]: NodeData };

function createNodeDataByKey(treeData: Node[]): NodeDataByKey {
  const result: NodeDataByKey = {};

  treeData.forEach((node) => {
    createNodeDataByKeyInner(result, node, null, 1);
  });

  return result;
}

function createNodeDataByKeyInner(
  result: NodeDataByKey,
  node: Node,
  parent: Node,
  level: number
) {
  result[node.id] = { node, parent, level };

  if (node.children) {
    node.children.forEach((child) => {
      createNodeDataByKeyInner(result, child, node, level + 1);
    });
  }
}

export function findNode(treeData: Node[], id: string): Node {
  const nodeDataByKey = createNodeDataByKey(treeData);
  return nodeDataByKey[id] ? nodeDataByKey[id].node : null;
}

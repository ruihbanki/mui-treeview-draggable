import { Node } from "../components/DataTreeView/DataTreeView.types";
import { Position } from "../components/TreeView/TreeView.types";

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

function findPath(nodeDataByKey: NodeDataByKey, id: string): Node[] {
  let cur = nodeDataByKey[id];

  if (!cur) {
    return null;
  }

  const result = [];

  /* eslint-disable */
  while (true) {
    result.unshift(cur.node);
    if (!cur.parent) {
      break;
    }
    cur = nodeDataByKey[cur.parent.id];
  }

  return result;
}

function insertNodeBeforeOrAfter(
  treeData: Node[],
  id: string,
  position: Position,
  node: Node
): Node[] {
  const nodeDataByKey = createNodeDataByKey(treeData);
  const path = findPath(nodeDataByKey, id);
  const result = [...treeData];

  let childrenArr = result;
  path.forEach((item) => {
    const index = childrenArr.findIndex((i) => i.id === item.id);
    if (item.id === id) {
      if (position === "after") {
        childrenArr.splice(index + 1, 0, node);
      } else if (position === "before") {
        childrenArr.splice(index, 0, node);
      } else {
        throw new Error("Invalid position");
      }
    } else {
      childrenArr[index] = {
        ...item,
        children: [...childrenArr[index].children],
      };
      childrenArr = childrenArr[index].children;
    }
  });

  return result;
}

function insertNodeInside(treeData: Node[], id: string, node: Node) {
  const nodeDataByKey = createNodeDataByKey(treeData);
  const path = findPath(nodeDataByKey, id);
  const result = [...treeData];

  let childrenArr = result;
  path.forEach((item) => {
    const index = childrenArr.findIndex((i) => i.id === item.id);
    if (item.id === id) {
      if (childrenArr[index].children) {
        childrenArr[index] = {
          ...item,
          children: [node, ...childrenArr[index].children],
        };
      } else {
        childrenArr[index] = {
          ...item,
          children: [node],
        };
      }
    } else {
      childrenArr[index] = {
        ...item,
        children: [...childrenArr[index].children],
      };
      childrenArr = childrenArr[index].children;
    }
  });

  return result;
}

export function insertNode(
  treeData: Node[],
  id: string,
  position: Position,
  node: Node
) {
  if (position === "inside") {
    return insertNodeInside(treeData, id, node);
  }
  return insertNodeBeforeOrAfter(treeData, id, position, node);
}

export function findNode(treeData: Node[], id: string): Node {
  const nodeDataByKey = createNodeDataByKey(treeData);
  return nodeDataByKey[id] ? nodeDataByKey[id].node : null;
}

export function findParentNode(treeData: Node[], id: string): Node | null {
  const nodeDataByKey = createNodeDataByKey(treeData);
  if (!nodeDataByKey[id]) {
    return null;
  }
  return nodeDataByKey[id].parent;
}

export function removeNode(treeData: Node[], id: string) {
  const nodeDataByKey = createNodeDataByKey(treeData);
  const path = findPath(nodeDataByKey, id);

  if (!path) {
    return treeData;
  }

  const result = [...treeData];
  let childrenArr = result;
  path.forEach((item) => {
    const index = childrenArr.findIndex((i) => i.id === item.id);
    if (item.id === id) {
      childrenArr.splice(index, 1);
    } else {
      childrenArr[index] = {
        ...item,
        children: [...childrenArr[index].children],
      };
      childrenArr = childrenArr[index].children;
    }
  });

  return result;
}

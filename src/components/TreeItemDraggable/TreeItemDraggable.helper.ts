type Position = "before" | "after" | "inside";

interface DropTarget {
  position: Position; 
  toItemElement: Element;
}

export function createDropTargetList(rootTreeNode: Element): DropTarget[] {
  const result: DropTarget[] = [];
  const firstNode = rootTreeNode.children?.[0];

  result.push({
    position: "before",
    toItemElement: firstNode
  });

  addToDropTargetList(result, firstNode);

  console.log(JSON.stringify(result.map(item => ({
    position: item.position,
    id: item.toItemElement.getAttribute("data-nodeid"),
  })), null, 2));

  return result;
}

function addToDropTargetList(result: DropTarget[], node: Element): void {
  result.push({
    position: "inside",
    toItemElement: node
  });

  const firstNodeChild = getFirstNodeChild(node);
  if (firstNodeChild) {
    addToDropTargetList(result, firstNodeChild);
  } 

  result.push({
    position: "after",
    toItemElement: node
  });

  const nextNode: Element = node.nextElementSibling;
  if (nextNode) {
    addToDropTargetList(result, nextNode);  
  }
}

function getFirstNodeChild(node: Element) {
  const ul = Array.from(node.children).find(child => child.nodeName === "UL");
  if (!ul) {
    return null;
  }
  return ul.children[0].querySelector("li");
}


export function getDropPosition(target: Element, clientX: number, clientY:number): Position {
  const targetRect = target.getBoundingClientRect();

  const middleY = targetRect.top + targetRect.height / 2;

  if (clientY < middleY) {
    return "before";
  }

  if (clientX > targetRect.left + 60) {
    return "inside";
  }

  return "after";
}

export function getTreeRootElement(li: HTMLLIElement): Element {
  return li.closest(".MuiTreeView-root") as HTMLUListElement;
}

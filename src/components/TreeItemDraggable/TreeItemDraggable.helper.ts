export function getNodeElement(event) {
  return event.currentTarget.closest(".MuiTreeItem-root") as HTMLLIElement;
}

export function getTreeRootElement(li: HTMLLIElement) {
  return li.closest(".MuiTreeView-root") as HTMLUListElement;
}

export function getDropPosition(target, clientX, clientY) {
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

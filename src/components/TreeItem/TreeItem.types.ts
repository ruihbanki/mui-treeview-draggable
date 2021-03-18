import { Position } from "../TreeView/TreeView.types";

export interface DropTarget {
  position: Position;
  toItemElement: Element;
}

export interface DragState {
  fromItemElement: Element;
  toItemElement: Element;
  treeViewElement: Element;
  scrollContainer: Element;
  position: Position;
  toNodeId: string;
}

export interface DropTargetList {
  position: Position;
  toItemElement: Element;
}

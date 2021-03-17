import { Position } from "../TreeViewDraggable/TreeViewDraggable.types";

export interface DropTarget {
  position: Position;
  toItemElement: Element;
}

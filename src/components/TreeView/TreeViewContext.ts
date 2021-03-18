import React from "react";

import { Position } from "./TreeView.types";

interface Context {
  draggable: boolean;
  onDrop?: ({
    fromNodeId,
    toNodeId,
    position,
  }: {
    fromNodeId: string;
    toNodeId: string;
    position: Position;
  }) => void;
  allowDrop?: ({
    fromNodeId,
    toNodeId,
    position,
  }: {
    fromNodeId: string;
    toNodeId: string;
    position: Position;
  }) => boolean;
}

export default React.createContext<Context | null>(null);

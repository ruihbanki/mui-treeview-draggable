import React from "react";

type Position = "before" | "after" | "inside";
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

import React from "react";

type Position = "before" | "after" | "inside";
interface Context {
  allowDragging: boolean,
  onDrop?: ({fromNodeId, toNodeId, position} : { fromNodeId: string, toNodeId:string, position: Position }) => void
}

export default React.createContext<Context | null>(null);

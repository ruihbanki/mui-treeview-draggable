import React from "react";

type Position = "before" | "after" | "inside";
interface Context {
  allowDragging: boolean,
  startDragging: (fromNodeId: string) => void,
  stopDragging: () => void,
  fromNodeId: string,
  onDrop?: (fromNodeId: string, toNodeId:string, position: Position) => void
}

export default React.createContext<Context | null>(null);

import React from "react";
import { TreeViewProps } from "../TreeView/TreeView.types";

/* eslint-disable @typescript-eslint/no-explicit-any */
type GenericObject = { [key: string]: any };

type DataTreeViewPropsBase = {
  data: GenericObject;
  getNodeId: (node: GenericObject) => string;
  getNodeLabel: (node: GenericObject) => React.ReactNode;
  getNodeChildren: (node: GenericObject) => GenericObject[];
};

export type DataTreeViewProps = DataTreeViewPropsBase & TreeViewProps;

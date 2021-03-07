import React from "react";
import { mount } from "@cypress/react";

import TreeViewDraggable from "./TreeViewDraggable";
import TreeItemDraggable from "../TreeItemDraggable";

describe("TreeViewDraggable", function () {
  it("should render correctly the tree", function () {
    mountComponent();
    cy.contains("Item 1").should("exist");
    cy.contains("Item 2").should("exist");
    cy.contains("Item 2.1").should("exist");
    cy.contains("Item 2.1.1").should("exist");
    cy.contains("Item 3").should("exist");
  });
});

function mountComponent() {
  mount(
    <TreeViewDraggable defaultExpanded={["item-2", "item-2-1"]}>
      <TreeItemDraggable nodeId="item-1" label="Item 1" />
      <TreeItemDraggable nodeId="item-2" label="Item 2">
        <TreeItemDraggable nodeId="item-2-1" label="Item 2.1">
          <TreeItemDraggable nodeId="item-2-1-1" label="Item 2.1.1" />
        </TreeItemDraggable>
      </TreeItemDraggable>
      <TreeItemDraggable nodeId="item-3" label="Item 3" />
    </TreeViewDraggable>
  );
}

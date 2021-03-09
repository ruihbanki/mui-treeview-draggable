import React from "react";
import { mount } from "@cypress/react";

import TreeViewDraggable from "./TreeViewDraggable";
import TreeItemDraggable from "../TreeItemDraggable";
import TreeViewDraggableProps from "./TreeViewDraggableProps";

describe("TreeViewDraggable", function () {
  it("should render correctly the tree", function () {
    mountComponent();
    cy.contains("Item 1").should("exist");
    cy.contains("Item 2").should("exist");
    cy.contains("Item 2.1").should("exist");
    cy.contains("Item 2.1.1").should("exist");
    cy.contains("Item 3").should("exist");
  });

  describe("on a mouse device", function () {
    it("should set the attribute data-dragging to true when keep pressing the mouse", function () {
      mountComponent({ allowDragging: true });
      cy.contains("Item 2.1.1").trigger("mousedown");
      cy.contains("Item 2.1.1")
        .closest("li")
        .invoke("attr", "data-dragging")
        .should("equal", "true");
    });

    it("should not set the attribute data-dragging to true when pressing and release the mouse", function () {
      mountComponent({ allowDragging: true });
      cy.contains("Item 2.1.1")
        .trigger("mousedown")
        .wait(100)
        .trigger("mouseup");
      cy.wait(500)
        .contains("Item 2.1.1")
        .closest("li")
        .invoke("attr", "data-dragging")
        .should("equal", "false");
    });

    it("should not set the attribute data-dragging to true when pressing and move the mouse", function () {
      mountComponent({ allowDragging: true });
      cy.contains("Item 2.1.1")
        .trigger("mousedown")
        .wait(100)
        .trigger("mousemove");
      cy.wait(500)
        .contains("Item 2.1.1")
        .closest("li")
        .invoke("attr", "data-dragging")
        .should("equal", "false");
    });

    it.only("should not select when start dragging an item", function () {
      mountComponent({ allowDragging: true });
      cy.contains("Item 2.1.1").trigger("mousedown");
      cy.wait(500)
        .contains("Item 2.1.1")
        .closest("li")
        .trigger("click")
        .invoke("attr", "aria-selected")
        .should("not.exist");
    });
  });

  describe("on a touch device", function () {
    it("should set the attribute data-dragging to true when keep touching", function () {
      mountComponent({ allowDragging: true });
      cy.contains("Item 2.1.1").trigger("touchstart");
      cy.contains("Item 2.1.1")
        .closest("li")
        .invoke("attr", "data-dragging")
        .should("equal", "true");
    });

    it("should not set the attribute data-dragging to true when touch and release", function () {
      mountComponent({ allowDragging: true });
      cy.contains("Item 2.1.1")
        .trigger("touchstart")
        .wait(100)
        .trigger("touchend");
      cy.wait(500)
        .contains("Item 2.1.1")
        .closest("li")
        .invoke("attr", "data-dragging")
        .should("equal", "false");
    });
  });
});

function mountComponent(props: TreeViewDraggableProps = {}) {
  mount(
    <TreeViewDraggable defaultExpanded={["item-2", "item-2-1"]} {...props}>
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

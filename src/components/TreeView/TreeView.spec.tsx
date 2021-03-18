import React from "react";
import { mount } from "@cypress/react";

import TreeView from "./TreeView";
import TreeItem from "../TreeItem";
import { TreeViewProps } from "./TreeView.types";

describe("TreeView", function () {
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
      mountComponent({ draggable: true });
      cy.contains("Item 2.1.1").trigger("mousedown");
      cy.contains("Item 2.1.1")
        .closest("li")
        .invoke("attr", "data-dragging")
        .should("equal", "true");
    });

    it("should not set the attribute data-dragging to true when pressing and release the mouse", function () {
      mountComponent({ draggable: true });
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
      mountComponent({ draggable: true });
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

    it("should not select when start dragging an item", function () {
      mountComponent({ draggable: true });
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
      mountComponent({ draggable: true });
      cy.contains("Item 2.1.1").trigger("touchstart");
      cy.contains("Item 2.1.1")
        .closest("li")
        .invoke("attr", "data-dragging")
        .should("equal", "true");
    });

    it("should not set the attribute data-dragging to true when touch and release", function () {
      mountComponent({ draggable: true });
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

function mountComponent(props: TreeViewProps = {}) {
  mount(
    <TreeView defaultExpanded={["item-2", "item-2-1"]} {...props}>
      <TreeItem nodeId="item-1" label="Item 1" />
      <TreeItem nodeId="item-2" label="Item 2">
        <TreeItem nodeId="item-2-1" label="Item 2.1">
          <TreeItem nodeId="item-2-1-1" label="Item 2.1.1" />
        </TreeItem>
      </TreeItem>
      <TreeItem nodeId="item-3" label="Item 3" />
    </TreeView>
  );
}

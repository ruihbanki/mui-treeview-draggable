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

  it("should render items without aria-grabbed when a tree view not is draggable", function () {
    mountComponent();
    cy.contains("Item 1")
      .closest("li")
      .invoke("attr", "aria-grabbed")
      .should("equal", undefined);
  });

  it("should render items with aria-grabbed equal to false when a tree view is draggable", function () {
    mountComponent({ draggable: true });
    cy.contains("Item 1")
      .closest("li")
      .invoke("attr", "aria-grabbed")
      .should("equal", "false");
  });

  describe("on a mouse device", function () {
    it("should set the attribute aria-grabbed to true when keep pressing the mouse", function () {
      mountComponent({ draggable: true });
      cy.contains("Item 2.1.1").trigger("mousedown");
      cy.contains("Item 2.1.1")
        .closest("li")
        .invoke("attr", "aria-grabbed")
        .should("equal", "true");
    });

    it("should not set the attribute aria-grabbed to true when pressing and release the mouse", function () {
      mountComponent({ draggable: true });
      cy.contains("Item 2.1.1")
        .trigger("mousedown")
        .wait(100)
        .trigger("mouseup");
      cy.wait(500)
        .contains("Item 2.1.1")
        .closest("li")
        .invoke("attr", "aria-grabbed")
        .should("equal", "false");
    });

    it("should not set the attribute aria-grabbed to true when pressing and move the mouse", function () {
      mountComponent({ draggable: true });
      cy.contains("Item 2.1.1")
        .trigger("mousedown")
        .wait(100)
        .trigger("mousemove");
      cy.wait(500)
        .contains("Item 2.1.1")
        .closest("li")
        .invoke("attr", "aria-grabbed")
        .should("equal", "false");
    });

    it("should call onNodeDrop when drop before a node", function () {
      const onNodeDrop = cy.stub();
      mountComponent({ draggable: true, onNodeDrop });
      cy.contains("Item 3").trigger("mousedown").wait(500);
      cy.contains("Item 2.1.1").trigger("mousemove", "topLeft");
      cy.contains("Item 3")
        .trigger("mouseup")
        .then(() => {
          expect(onNodeDrop).to.be.calledWith({
            fromNodeId: "item-3",
            toNodeId: "item-2-1-1",
            position: "before",
          });
        });
    });

    it("should call onNodeDrop when drop after a node", function () {
      const onNodeDrop = cy.stub();
      mountComponent({ draggable: true, onNodeDrop });
      cy.contains("Item 3").trigger("mousedown").wait(500);
      cy.contains("Item 2.1.1").trigger("mousemove", "bottomLeft");
      cy.contains("Item 3")
        .trigger("mouseup")
        .then(() => {
          expect(onNodeDrop).to.be.calledWith({
            fromNodeId: "item-3",
            toNodeId: "item-2-1-1",
            position: "after",
          });
        });
    });

    it("should call onNodeDrop when drop inside a node", function () {
      const onNodeDrop = cy.stub();
      mountComponent({ draggable: true, onNodeDrop });
      cy.contains("Item 3").trigger("mousedown").wait(500);
      cy.contains("Item 2.1.1").trigger("mousemove", "bottomRight");
      cy.contains("Item 3")
        .trigger("mouseup")
        .then(() => {
          expect(onNodeDrop).to.be.calledWith({
            fromNodeId: "item-3",
            toNodeId: "item-2-1-1",
            position: "inside",
          });
        });
    });
  });

  describe("on a touch device", function () {
    it("should set the attribute aria-grabbed to true when keep touching", function () {
      mountComponent({ draggable: true });
      cy.contains("Item 2.1.1").trigger("touchstart");
      cy.contains("Item 2.1.1")
        .closest("li")
        .invoke("attr", "aria-grabbed")
        .should("equal", "true");
    });

    it("should not set the attribute aria-grabbed to true when touch and release", function () {
      mountComponent({ draggable: true });
      cy.contains("Item 2.1.1")
        .trigger("touchstart")
        .wait(100)
        .trigger("touchend");
      cy.wait(500)
        .contains("Item 2.1.1")
        .closest("li")
        .invoke("attr", "aria-grabbed")
        .should("equal", "false");
    });

    it("should call onNodeDrop when drop before a node", function () {
      const onNodeDrop = cy.stub();
      mountComponent({ draggable: true, onNodeDrop });
      cy.contains("Item 3").trigger("touchstart").wait(500);
      cy.contains("Item 2.1.1").trigger("touchmove", "topLeft");
      cy.contains("Item 3")
        .trigger("touchend")
        .then(() => {
          expect(onNodeDrop).to.be.calledWith({
            fromNodeId: "item-3",
            toNodeId: "item-2-1-1",
            position: "before",
          });
        });
    });

    it("should call onNodeDrop when drop after a node", function () {
      const onNodeDrop = cy.stub();
      mountComponent({ draggable: true, onNodeDrop });
      cy.contains("Item 3").trigger("touchstart").wait(500);
      cy.contains("Item 2.1.1").trigger("touchmove", "bottomLeft");
      cy.contains("Item 3")
        .trigger("touchend")
        .then(() => {
          expect(onNodeDrop).to.be.calledWith({
            fromNodeId: "item-3",
            toNodeId: "item-2-1-1",
            position: "after",
          });
        });
    });

    it("should call onNodeDrop when drop inside a node", function () {
      const onNodeDrop = cy.stub();
      mountComponent({ draggable: true, onNodeDrop });
      cy.contains("Item 3").trigger("touchstart").wait(500);
      cy.contains("Item 2.1.1").trigger("touchmove", "bottomRight");
      cy.contains("Item 3")
        .trigger("touchend")
        .then(() => {
          expect(onNodeDrop).to.be.calledWith({
            fromNodeId: "item-3",
            toNodeId: "item-2-1-1",
            position: "inside",
          });
        });
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

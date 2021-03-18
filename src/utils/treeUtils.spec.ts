import { findNode, findParentNode, insertNode, removeNode } from "./treeUtils";

const treeData = [
  { label: "Item 1", id: "1" },
  {
    label: "Item 2",
    id: "2",
    children: [
      { label: "Item 3", id: "3" },
      { label: "Item 4", id: "4" },
    ],
  },
  { label: "Item 5", id: "5" },
];

describe("The treeUtils", function () {
  describe("findNode", function () {
    it("should return the node node when it exists", function () {
      const result = findNode(treeData, "3");
      expect(result.id).to.equal("3");
    });

    it("should return null node when it does not exist", function () {
      const result = findNode(treeData, "9999");
      expect(result).to.equal(null);
    });
  });

  describe("findParentNode", function () {
    it("should return the parent node when it exists", function () {
      const result = findParentNode(treeData, "3");
      expect(result.label).to.equal("Item 2");
    });

    it("should return null node when the parent does not exist", function () {
      const result = findParentNode(treeData, "5");
      expect(result).to.equal(null);
    });

    it("should return null node when pass a id that does not exist", function () {
      const result = findParentNode(treeData, "99999");
      expect(result).to.equal(null);
    });
  });

  describe("insertNode", function () {
    it("should insert the node before", function () {
      const result = insertNode(treeData, "1", "before", {
        label: "New item",
        id: "6",
      });

      expect(result).to.deep.equal([
        { label: "New item", id: "6" },
        { label: "Item 1", id: "1" },
        {
          label: "Item 2",
          id: "2",
          children: [
            { label: "Item 3", id: "3" },
            { label: "Item 4", id: "4" },
          ],
        },
        { label: "Item 5", id: "5" },
      ]);
    });

    it("should insert the node before when it is inside another node", function () {
      const result = insertNode(treeData, "4", "before", {
        label: "New item",
        id: "6",
      });

      expect(result).to.deep.equal([
        { label: "Item 1", id: "1" },
        {
          label: "Item 2",
          id: "2",
          children: [
            { label: "Item 3", id: "3" },
            { label: "New item", id: "6" },
            { label: "Item 4", id: "4" },
          ],
        },
        { label: "Item 5", id: "5" },
      ]);
    });

    it("should insert the node after", function () {
      const result = insertNode(treeData, "1", "after", {
        label: "New item",
        id: "6",
      });

      expect(result).to.deep.equal([
        { label: "Item 1", id: "1" },
        { label: "New item", id: "6" },
        {
          label: "Item 2",
          id: "2",
          children: [
            { label: "Item 3", id: "3" },
            { label: "Item 4", id: "4" },
          ],
        },
        { label: "Item 5", id: "5" },
      ]);
    });

    it("should insert the node after when it is inside another node", function () {
      const result = insertNode(treeData, "4", "after", {
        label: "New item",
        id: "6",
      });

      expect(result).to.deep.equal([
        { label: "Item 1", id: "1" },
        {
          label: "Item 2",
          id: "2",
          children: [
            { label: "Item 3", id: "3" },
            { label: "Item 4", id: "4" },
            { label: "New item", id: "6" },
          ],
        },
        { label: "Item 5", id: "5" },
      ]);
    });

    it("should insert the node inside", function () {
      const result = insertNode(treeData, "1", "inside", {
        label: "New item",
        id: "6",
      });

      expect(result).to.deep.equal([
        {
          label: "Item 1",
          id: "1",
          children: [{ label: "New item", id: "6" }],
        },
        {
          label: "Item 2",
          id: "2",
          children: [
            { label: "Item 3", id: "3" },
            { label: "Item 4", id: "4" },
          ],
        },
        { label: "Item 5", id: "5" },
      ]);
    });

    it("should insert the node inside in a nested structure", function () {
      const result = insertNode(treeData, "2", "inside", {
        label: "New item",
        id: "6",
      });

      expect(result).to.deep.equal([
        { label: "Item 1", id: "1" },
        {
          label: "Item 2",
          id: "2",
          children: [
            { label: "New item", id: "6" },
            { label: "Item 3", id: "3" },
            { label: "Item 4", id: "4" },
          ],
        },
        { label: "Item 5", id: "5" },
      ]);
    });
  });

  describe("removeNode", function () {
    it("should remove a node", function () {
      const result = removeNode(treeData, "1");

      expect(result).to.deep.equal([
        {
          label: "Item 2",
          id: "2",
          children: [
            { label: "Item 3", id: "3" },
            { label: "Item 4", id: "4" },
          ],
        },
        { label: "Item 5", id: "5" },
      ]);
    });

    it("should remove a node in a nested structure", function () {
      const result = removeNode(treeData, "3");

      expect(result).to.deep.equal([
        { label: "Item 1", id: "1" },
        {
          label: "Item 2",
          id: "2",
          children: [{ label: "Item 4", id: "4" }],
        },
        { label: "Item 5", id: "5" },
      ]);
    });
  });
});
